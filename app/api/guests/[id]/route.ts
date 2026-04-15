import { NextRequest, NextResponse } from "next/server"
import { getTenantClient } from "@/lib/supabase/tenant"
import { getCurrentUser } from "@/lib/auth/get-user"
import { headers } from "next/headers"
import type { Guest, Reservation } from "@/types/database"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/guests/[id]
 * Returns a guest with their reservations
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const headersList = await headers()
  const tenantId = headersList.get("x-tenant-id")
  const user = await getCurrentUser(tenantId)
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { id } = await params
  const supabase = await getTenantClient()

  // Get guest
  const { data: guest, error: guestError } = await supabase
    .from("guests")
    .select("*")
    .eq("id", id)
    .single()
    .returns<Guest>()

  if (guestError) {
    if (guestError.code === "PGRST116") {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Erreur lors de la récupération du client", details: guestError.message },
      { status: 500 }
    )
  }

  // Get guest's reservations
  const { data: reservations, error: reservationsError } = await supabase
    .from("reservations")
    .select("*, rooms(*)")
    .eq("guest_id", id)
    .order("created_at", { ascending: false })
    .returns<(Reservation & { rooms: unknown })[]>()

  if (reservationsError) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des réservations", details: reservationsError.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ guest, reservations: reservations ?? [] })
}

/**
 * PUT /api/guests/[id]
 * Updates a guest
 * Body: { full_name, phone?, email?, id_type?, id_number?, notes? }
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
      .update({
        full_name,
        phone: phone ?? null,
        email: email ?? null,
        id_type: id_type ?? null,
        id_number: id_number ?? null,
        notes: notes ?? null,
      })
      .eq("id", id)
      .select()
      .single()
      .returns<Guest>()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Client non trouvé" }, { status: 404 })
      }
      return NextResponse.json(
        { error: "Échec de la mise à jour", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ guest: data })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/guests/[id]
 * Deletes a guest (only if no active reservations)
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

  // Check for active reservations
  const { data: activeReservations } = await supabase
    .from("reservations")
    .select("id")
    .eq("guest_id", id)
    .in("status", ["pending", "confirmed", "checked_in"])
    .limit(1)

  if (activeReservations && activeReservations.length > 0) {
    return NextResponse.json(
      { error: "Impossible de supprimer un client avec des réservations actives" },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from("guests")
    .delete()
    .eq("id", id)

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Échec de la suppression", details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
