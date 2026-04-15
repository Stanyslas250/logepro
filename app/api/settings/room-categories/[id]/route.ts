import { NextRequest, NextResponse } from "next/server"
import { getTenantClient } from "@/lib/supabase/tenant"
import { getCurrentUser } from "@/lib/auth/get-user"
import { headers } from "next/headers"
import type { RoomCategory } from "@/types/database"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * PUT /api/settings/room-categories/[id]
 * Updates a room category
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
    const { name, subtitle, status_label, base_rate, capacity, room_numbers } = body

    const supabase = await getTenantClient()

    const { data, error } = await supabase
      .from("room_categories")
      .update({
        name,
        subtitle: subtitle ?? null,
        status_label,
        base_rate,
        capacity,
        room_numbers: room_numbers ?? [],
      })
      .eq("id", id)
      .select()
      .single()
      .returns<RoomCategory>()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Catégorie non trouvée" }, { status: 404 })
      }
      return NextResponse.json(
        { error: "Échec de la mise à jour", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ category: data })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/settings/room-categories/[id]
 * Deletes a room category
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
    .from("room_categories")
    .delete()
    .eq("id", id)

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "Catégorie non trouvée" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Échec de la suppression", details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
