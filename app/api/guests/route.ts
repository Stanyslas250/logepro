import { NextRequest, NextResponse } from "next/server"
import { getTenantClient } from "@/lib/supabase/tenant"
import { getCurrentUser } from "@/lib/auth/get-user"
import { headers } from "next/headers"

/**
 * GET /api/guests
 * Search guests by name or email.
 * Query params: search, page, per_page
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
  const search = searchParams.get("search")
  const page = parseInt(searchParams.get("page") ?? "1", 10)
  const perPage = parseInt(searchParams.get("per_page") ?? "20", 10)
  const offset = (page - 1) * perPage

  let query = supabase
    .from("guests")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1)

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    )
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération", details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    guests: data ?? [],
    total: count ?? 0,
    page,
    per_page: perPage,
  })
}

/**
 * POST /api/guests
 * Create a new guest.
 * Body: { full_name, phone?, email?, id_type?, id_number?, notes? }
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
    const { full_name, phone, email, id_type, id_number, notes } = body

    if (!full_name) {
      return NextResponse.json(
        { error: "full_name est requis" },
        { status: 400 }
      )
    }

    const supabase = await getTenantClient()

    const { data, error } = await supabase
      .from("guests")
      .insert({
        full_name,
        phone: phone ?? null,
        email: email ?? null,
        id_type: id_type ?? null,
        id_number: id_number ?? null,
        notes: notes ?? null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Échec de la création", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ guest: data }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}
