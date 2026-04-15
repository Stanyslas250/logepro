import { NextRequest, NextResponse } from "next/server"
import { getTenantClient } from "@/lib/supabase/tenant"
import { getCurrentUser } from "@/lib/auth/get-user"
import { headers } from "next/headers"
import type { HotelFloor } from "@/types/database"

/**
 * GET /api/settings/floors
 * Returns all hotel floors
 */
export async function GET(request: NextRequest) {
  const headersList = await headers()
  const tenantId = headersList.get("x-tenant-id")
  const user = await getCurrentUser(tenantId)
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const supabase = await getTenantClient()

  const { data, error } = await supabase
    .from("hotel_floors")
    .select("*")
    .order("floor_number", { ascending: true })
    .returns<HotelFloor[]>()

  if (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des étages", details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ floors: data ?? [] })
}

/**
 * POST /api/settings/floors
 * Creates a new hotel floor
 * Body: { name, floor_number, room_count? }
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
    const { name, floor_number, room_count } = body

    if (!name || floor_number === undefined) {
      return NextResponse.json(
        { error: "name et floor_number sont requis" },
        { status: 400 }
      )
    }

    const supabase = await getTenantClient()

    const { data, error } = await supabase
      .from("hotel_floors")
      .insert({
        name,
        floor_number,
        room_count: room_count ?? 0,
      })
      .select()
      .single()
      .returns<HotelFloor>()

    if (error) {
      return NextResponse.json(
        { error: "Échec de la création de l'étage", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ floor: data }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}
