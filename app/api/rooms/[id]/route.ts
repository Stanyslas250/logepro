import { NextRequest, NextResponse } from "next/server"
import { getTenantClient } from "@/lib/supabase/tenant"
import { getCurrentUser } from "@/lib/auth/get-user"
import { headers } from "next/headers"
import type { Room } from "@/types/database"

interface RouteParams {
  params: Promise<{ id: string }>
}

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
    const { number, floor, type, capacity, rate, status } = body

    const patch: Record<string, unknown> = {}
    if (number !== undefined) patch.number = number
    if (floor !== undefined) patch.floor = floor
    if (type !== undefined) patch.type = type
    if (capacity !== undefined) patch.capacity = capacity
    if (rate !== undefined) patch.rate = rate
    if (status !== undefined) patch.status = status

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Aucun champ à mettre à jour" }, { status: 400 })
    }

    const supabase = await getTenantClient()

    const { data, error } = await supabase
      .from("rooms")
      .update(patch)
      .eq("id", id)
      .select()
      .single()
      .returns<Room>()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Chambre non trouvée" }, { status: 404 })
      }
      return NextResponse.json(
        { error: "Échec de la mise à jour", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ room: data })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const headersList = await headers()
  const tenantId = headersList.get("x-tenant-id")
  const user = await getCurrentUser(tenantId)
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { id } = await params

  const supabase = await getTenantClient()

  const { error } = await supabase.from("rooms").delete().eq("id", id)

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "Chambre non trouvée" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Échec de la suppression", details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
