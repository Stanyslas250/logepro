import { NextRequest, NextResponse } from "next/server"
import { getTenantClient } from "@/lib/supabase/tenant"
import { getCurrentUser } from "@/lib/auth/get-user"
import { headers } from "next/headers"
import type { SupportTicket } from "@/types/database"

/**
 * GET /api/support/tickets
 * Returns all support tickets for the current user
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
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("created_by", user.id)

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.returns<SupportTicket[]>()

  if (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des tickets", details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ tickets: data ?? [] })
}

/**
 * POST /api/support/tickets
 * Creates a new support ticket
 * Body: { subject, description, priority? }
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
    const { subject, description, priority } = body

    if (!subject || !description) {
      return NextResponse.json(
        { error: "subject et description sont requis" },
        { status: 400 }
      )
    }

    if (priority && !["low", "medium", "high"].includes(priority)) {
      return NextResponse.json(
        { error: "priority doit être 'low', 'medium' ou 'high'" },
        { status: 400 }
      )
    }

    const supabase = await getTenantClient()

    const { data, error } = await supabase
      .from("support_tickets")
      .insert({
        subject,
        description,
        priority: priority ?? "medium",
        created_by: user.id,
      })
      .select()
      .single()
      .returns<SupportTicket>()

    if (error) {
      return NextResponse.json(
        { error: "Échec de la création du ticket", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ ticket: data }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}
