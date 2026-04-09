import { NextRequest, NextResponse } from "next/server"
import { getTenantClient } from "@/lib/supabase/tenant"
import { getCurrentUser } from "@/lib/auth/get-user"
import { headers } from "next/headers"

/**
 * GET /api/reservations
 * List reservations with optional filters and pagination.
 * Query params: status, room_type, page, per_page, search
 */
export async function GET(request: NextRequest) {
  const headersList = await headers()
  const tenantId = headersList.get("x-tenant-id")
  const user = await getCurrentUser(tenantId)
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const supabase = await getTenantClient()
  const { searchParams } = request.nextUrl
  const status = searchParams.get("status")
  const roomType = searchParams.get("room_type")
  const search = searchParams.get("search")
  const page = parseInt(searchParams.get("page") ?? "1", 10)
  const perPage = parseInt(searchParams.get("per_page") ?? "20", 10)
  const offset = (page - 1) * perPage

  let query = supabase
    .from("reservations")
    .select("*, rooms(*), guests(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1)

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  if (roomType && roomType !== "all") {
    query = query.eq("rooms.type", roomType)
  }

  if (search) {
    query = query.or(`guests.full_name.ilike.%${search}%,guests.email.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération", details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    reservations: data ?? [],
    total: count ?? 0,
    page,
    per_page: perPage,
  })
}

/**
 * POST /api/reservations
 * Create a new reservation.
 * Body: { guest_id, room_id, check_in, check_out, source?, notes?, total_amount }
 */
export async function POST(request: NextRequest) {
  const headersList = await headers()
  const tenantId = headersList.get("x-tenant-id")
  const user = await getCurrentUser(tenantId)
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { guest_id, room_id, check_in, check_out, source, notes, total_amount } = body

    if (!guest_id || !room_id || !check_in || !check_out || total_amount == null) {
      return NextResponse.json(
        { error: "guest_id, room_id, check_in, check_out et total_amount sont requis" },
        { status: 400 }
      )
    }

    const supabase = await getTenantClient()

    const { data, error } = await supabase
      .from("reservations")
      .insert({
        guest_id,
        room_id,
        check_in,
        check_out,
        source: source ?? "direct",
        notes: notes ?? null,
        total_amount,
        created_by: user.id,
        status: "confirmed",
      })
      .select("*, rooms(*), guests(*)")
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Échec de la création", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ reservation: data }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}
