import { NextRequest, NextResponse } from "next/server"
import { getTenantClient } from "@/lib/supabase/tenant"
import { getCurrentUser } from "@/lib/auth/get-user"
import { headers } from "next/headers"
import type { HotelFloor } from "@/types/database"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * PUT /api/settings/floors/[id]
 * Updates a hotel floor
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const headersList = await headers()
  const tenantId = headersList.get("x-tenant-id")
  const user = await getCurrentUser(tenantId)
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { name, floor_number, room_count } = body

    const supabase = await getTenantClient()

    const { data, error } = await supabase
      .from("hotel_floors")
      .update({
        name,
        floor_number,
        room_count: room_count ?? 0,
      })
      .eq("id", id)
      .select()
      .single()
      .returns<HotelFloor>()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Étage non trouvé" }, { status: 404 })
      }
      return NextResponse.json(
        { error: "Échec de la mise à jour", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ floor: data })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/settings/floors/[id]
 * Deletes a hotel floor
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const headersList = await headers()
  const tenantId = headersList.get("x-tenant-id")
  const user = await getCurrentUser(tenantId)
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { id } = await params

  const supabase = await getTenantClient()

  const { error } = await supabase
    .from("hotel_floors")
    .delete()
    .eq("id", id)

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "Étage non trouvé" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Échec de la suppression", details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
