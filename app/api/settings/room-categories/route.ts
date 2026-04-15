import { NextRequest, NextResponse } from "next/server"
import { getTenantClient } from "@/lib/supabase/tenant"
import { getCurrentUser } from "@/lib/auth/get-user"
import { headers } from "next/headers"
import type { RoomCategory } from "@/types/database"

/**
 * GET /api/settings/room-categories
 * Returns all room categories
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
    .from("room_categories")
    .select("*")
    .order("base_rate", { ascending: false })
    .returns<RoomCategory[]>()

  if (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories", details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ categories: data ?? [] })
}

/**
 * POST /api/settings/room-categories
 * Creates a new room category
 * Body: { name, subtitle?, status_label, base_rate, capacity, room_numbers? }
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
    const { name, subtitle, status_label, base_rate, capacity, room_numbers } = body

    if (!name || !status_label || base_rate === undefined || capacity === undefined) {
      return NextResponse.json(
        { error: "name, status_label, base_rate et capacity sont requis" },
        { status: 400 }
      )
    }

    const supabase = await getTenantClient()

    const { data, error } = await supabase
      .from("room_categories")
      .insert({
        name,
        subtitle: subtitle ?? null,
        status_label,
        base_rate,
        capacity,
        room_numbers: room_numbers ?? [],
      })
      .select()
      .single()
      .returns<RoomCategory>()

    if (error) {
      return NextResponse.json(
        { error: "Échec de la création de la catégorie", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ category: data }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}
