import { NextRequest, NextResponse } from "next/server"
import { getTenantClient } from "@/lib/supabase/tenant"
import { getCurrentUser } from "@/lib/auth/get-user"
import { headers } from "next/headers"
import type { SupportMessage } from "@/types/database"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/support/tickets/[id]/messages
 * Returns all messages for a ticket
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

  // Verify user owns the ticket
  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("id")
    .eq("id", id)
    .eq("created_by", user.id)
    .single()

  if (!ticket) {
    return NextResponse.json({ error: "Ticket non trouvé" }, { status: 404 })
  }

  const { data, error } = await supabase
    .from("support_messages")
    .select("*")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true })
    .returns<SupportMessage[]>()

  if (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages", details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ messages: data ?? [] })
}

/**
 * POST /api/support/tickets/[id]/messages
 * Adds a new message to a ticket
 * Body: { content }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const headersList = await headers()
  const tenantId = headersList.get("x-tenant-id")
  const user = await getCurrentUser(tenantId)
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { content } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "content est requis et ne doit pas être vide" },
        { status: 400 }
      )
    }

    const supabase = await getTenantClient()

    // Verify user owns the ticket
    const { data: ticket } = await supabase
      .from("support_tickets")
      .select("id")
      .eq("id", id)
      .eq("created_by", user.id)
      .single()

    if (!ticket) {
      return NextResponse.json({ error: "Ticket non trouvé" }, { status: 404 })
    }

    const { data, error } = await supabase
      .from("support_messages")
      .insert({
        ticket_id: id,
        sender_role: "tenant",
        content: content.trim(),
      })
      .select()
      .single()
      .returns<SupportMessage>()

    if (error) {
      return NextResponse.json(
        { error: "Échec de l'envoi du message", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: data }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}
