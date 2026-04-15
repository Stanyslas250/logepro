import { NextRequest, NextResponse } from "next/server"
import { getTenantClient } from "@/lib/supabase/tenant"
import { getCurrentUser } from "@/lib/auth/get-user"
import { headers } from "next/headers"
import type { SupportAppointment } from "@/types/database"

/**
 * GET /api/support/appointments
 * Returns all support appointments for the current user
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
  const status = searchParams.get("status")

  let query = supabase
    .from("support_appointments")
    .select("*")
    .order("scheduled_at", { ascending: true })
    .eq("created_by", user.id)

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.returns<SupportAppointment[]>()

  if (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des rendez-vous", details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ appointments: data ?? [] })
}

/**
 * POST /api/support/appointments
 * Creates a new support appointment
 * Body: { scheduled_at, topic }
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
    const { scheduled_at, topic } = body

    if (!scheduled_at || !topic) {
      return NextResponse.json(
        { error: "scheduled_at et topic sont requis" },
        { status: 400 }
      )
    }

    // Validate scheduled_at is a valid ISO date
    const scheduledDate = new Date(scheduled_at)
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { error: "scheduled_at doit être une date valide (ISO 8601)" },
        { status: 400 }
      )
    }

    const supabase = await getTenantClient()

    const { data, error } = await supabase
      .from("support_appointments")
      .insert({
        scheduled_at: scheduledDate.toISOString(),
        topic,
        created_by: user.id,
      })
      .select()
      .single()
      .returns<SupportAppointment>()

    if (error) {
      return NextResponse.json(
        { error: "Échec de la création du rendez-vous", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ appointment: data }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}
