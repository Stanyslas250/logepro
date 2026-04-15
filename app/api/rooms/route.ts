import { NextRequest, NextResponse } from "next/server"
import { getTenantClient } from "@/lib/supabase/tenant"
import { getCurrentUser } from "@/lib/auth/get-user"
import { headers } from "next/headers"
import type { Room } from "@/types/database"

export async function GET(request: NextRequest) {
  const headersList = await headers()
  const tenantId = headersList.get("x-tenant-id")
  const user = await getCurrentUser(tenantId)
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const supabase = await getTenantClient()
  const { searchParams } = request.nextUrl
  const floorParam = searchParams.get("floor")

  let query = supabase
    .from("rooms")
    .select("*")
    .order("floor", { ascending: true })
    .order("number", { ascending: true })

  if (floorParam) {
    query = query.eq("floor", parseInt(floorParam, 10))
  }

  const { data, error } = await query.returns<Room[]>()

  if (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des chambres", details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ rooms: data ?? [] })
}

export async function POST(request: NextRequest) {
  const headersList = await headers()
  const tenantId = headersList.get("x-tenant-id")
  const user = await getCurrentUser(tenantId)
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { number, floor, type, capacity, rate, status } = body

    if (!number || floor === undefined || !type) {
      return NextResponse.json(
        { error: "number, floor et type sont requis" },
        { status: 400 }
      )
    }

    const supabase = await getTenantClient()

    const { data, error } = await supabase
      .from("rooms")
      .insert({
        number,
        floor,
        type,
        capacity: capacity ?? 2,
        rate: rate ?? 0,
        status: status ?? "available",
      })
      .select()
      .single()
      .returns<Room>()

    if (error) {
      return NextResponse.json(
        { error: "Échec de la création de la chambre", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ room: data }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}
