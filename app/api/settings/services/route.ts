import { NextRequest, NextResponse } from "next/server"
import { getTenantClient } from "@/lib/supabase/tenant"
import { getCurrentUser } from "@/lib/auth/get-user"
import { headers } from "next/headers"
import type { Service } from "@/types/database"

/**
 * GET /api/settings/services
 * Returns all services
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
    .from("services")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true })
    .returns<Service[]>()

  if (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des services", details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ services: data ?? [] })
}

/**
 * POST /api/settings/services
 * Creates a new service
 * Body: { name, category, description, price_label, image_url?, is_available? }
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
    const { name, category, description, price_label, image_url, is_available } = body

    if (!name || !category || !description || !price_label) {
      return NextResponse.json(
        { error: "name, category, description et price_label sont requis" },
        { status: 400 }
      )
    }

    if (!["wellness", "logistics", "gastronomy"].includes(category)) {
      return NextResponse.json(
        { error: "category doit être 'wellness', 'logistics' ou 'gastronomy'" },
        { status: 400 }
      )
    }

    const supabase = await getTenantClient()

    const { data, error } = await supabase
      .from("services")
      .insert({
        name,
        category,
        description,
        price_label,
        image_url: image_url ?? null,
        is_available: is_available ?? true,
      })
      .select()
      .single()
      .returns<Service>()

    if (error) {
      return NextResponse.json(
        { error: "Échec de la création du service", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ service: data }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}
