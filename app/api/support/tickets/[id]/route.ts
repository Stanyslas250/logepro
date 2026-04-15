import { NextRequest, NextResponse } from "next/server"
import { getTenantClient } from "@/lib/supabase/tenant"
import { getCurrentUser } from "@/lib/auth/get-user"
import { headers } from "next/headers"
import type { SupportTicket } from "@/types/database"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/support/tickets/[id]
 * Returns a specific support ticket with its messages
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

  // Get ticket
  const { data: ticket, error: ticketError } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("id", id)
    .eq("created_by", user.id)
    .single()
    .returns<SupportTicket>()

  if (ticketError) {
    if (ticketError.code === "PGRST116") {
      return NextResponse.json({ error: "Ticket non trouvé" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Erreur lors de la récupération du ticket", details: ticketError.message },
      { status: 500 }
    )
  }

  // Get messages
  const { data: messages, error: messagesError } = await supabase
    .from("support_messages")
    .select("*")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true })

  if (messagesError) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages", details: messagesError.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ ticket, messages: messages ?? [] })
}

/**
 * PATCH /api/support/tickets/[id]
 * Updates ticket status
 * Body: { status }
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const headersList = await headers()
  const tenantId = headersList.get("x-tenant-id")
  const user = await getCurrentUser(tenantId)
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { status } = body

    if (!status || !["open", "in_progress", "resolved", "closed"].includes(status)) {
      return NextResponse.json(
        { error: "status doit être 'open', 'in_progress', 'resolved' ou 'closed'" },
        { status: 400 }
      )
    }

    const supabase = await getTenantClient()

    const { data, error } = await supabase
      .from("support_tickets")
      .update({ status })
      .eq("id", id)
      .eq("created_by", user.id)
      .select()
      .single()
      .returns<SupportTicket>()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Ticket non trouvé" }, { status: 404 })
      }
      return NextResponse.json(
        { error: "Échec de la mise à jour", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ ticket: data })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}
