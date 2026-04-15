import { NextRequest, NextResponse } from "next/server"
import { getTenantClient } from "@/lib/supabase/tenant"
import { getCurrentUser } from "@/lib/auth/get-user"
import { headers } from "next/headers"
import type { Service } from "@/types/database"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * PUT /api/settings/services/[id]
 * Updates a service
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
    const { name, category, description, price_label, image_url, is_available } = body

    if (category !== undefined && !["wellness", "logistics", "gastronomy"].includes(category)) {
      return NextResponse.json(
        { error: "category doit être 'wellness', 'logistics' ou 'gastronomy'" },
        { status: 400 }
      )
    }

    const patch: Record<string, unknown> = {}
    if (name !== undefined) patch.name = name
    if (category !== undefined) patch.category = category
    if (description !== undefined) patch.description = description
    if (price_label !== undefined) patch.price_label = price_label
    if (image_url !== undefined) patch.image_url = image_url
    if (is_available !== undefined) patch.is_available = is_available

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Aucun champ à mettre à jour" }, { status: 400 })
    }

    const supabase = await getTenantClient()

    const { data, error } = await supabase
      .from("services")
      .update(patch)
      .eq("id", id)
      .select()
      .single()
      .returns<Service>()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Service non trouvé" }, { status: 404 })
      }
      return NextResponse.json(
        { error: "Échec de la mise à jour", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ service: data })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/settings/services/[id]
 * Deletes a service
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
    .from("services")
    .delete()
    .eq("id", id)

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "Service non trouvé" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Échec de la suppression", details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
