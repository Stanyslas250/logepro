"use client"

import { useState, useEffect } from "react"
import {
  CreditCard,
  Rocket,
  Users as UsersIcon,
  Terminal,
  ExternalLink,
  MessageCircle,
  type LucideIcon,
} from "lucide-react"
import type { SupportTicket, SupportAppointment } from "@/types/database"
import { SupportHero } from "@/components/support/SupportHero"
import { ContactCard } from "@/components/support/ContactCard"
import { TicketList } from "@/components/support/TicketList"
import { LiveChat } from "@/components/support/LiveChat"
import { NewTicketForm } from "@/components/support/NewTicketForm"
import { AppointmentForm } from "@/components/support/AppointmentForm"

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  // const [appointments, setAppointments] = useState<SupportAppointment[]>([])
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false)
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [ticketsRes, appointmentsRes] = await Promise.all([
        fetch("/api/support/tickets"),
        fetch("/api/support/appointments"),
      ])

      if (ticketsRes.ok) {
        const ticketsData = await ticketsRes.json()
        setTickets(ticketsData.tickets || [])
      }

      if (appointmentsRes.ok) {
        // const appointmentsData = await appointmentsRes.json()
        // setAppointments(appointmentsData.appointments || [])
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTicket = async (ticket: Omit<SupportTicket, "id" | "ticket_number" | "created_by" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
      })

      if (response.ok) {
        const data = await response.json()
        setTickets((prev) => [data.ticket, ...prev])
        setSelectedTicketId(data.ticket.id)
        setIsChatOpen(true)
      }
    } catch (error) {
      console.error("Failed to create ticket:", error)
      throw error
    }
  }

  const handleCreateAppointment = async (appointment: Omit<SupportAppointment, "id" | "created_by" | "created_at">) => {
    try {
      const response = await fetch("/api/support/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointment),
      })

      if (response.ok) {
        // const data = await response.json()
        // setAppointments((prev) => [...prev, data.appointment])
      }
    } catch (error) {
      console.error("Failed to create appointment:", error)
      throw error
    }
  }

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId)
    setIsChatOpen(true)
  }

  const quickLinks: { icon: LucideIcon; label: string; href: string }[] = [
    { icon: CreditCard, label: "Facturation & Paiements", href: "#" },
    { icon: Rocket, label: "Configuration du compte", href: "#" },
    { icon: UsersIcon, label: "Permissions du personnel", href: "#" },
    { icon: Terminal, label: "Documentation développeur", href: "#" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Chargement…
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <SupportHero />

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <ContactCard
          icon="chat_bubble"
          title="Chat en direct avec un agent concierge"
          description="Réponse immédiate pour les urgences opérationnelles et les demandes rapides."
          action="Commencer la conversation"
          onClick={() => {
            if (!selectedTicketId) {
              setIsNewTicketOpen(true)
            } else {
              setIsChatOpen(true)
            }
          }}
          color="primary"
        />
        <ContactCard
          icon="confirmation_number"
          title="Soumettre un ticket technique"
          description="Rapports détaillés pour les problèmes d'intégration ou les bugs logiciels nécessitant une investigation."
          action="Créer un ticket"
          onClick={() => setIsNewTicketOpen(true)}
          color="tertiary"
        />
        <ContactCard
          icon="calendar_today"
          title="Planifier un appel de réussite"
          description="Réservez une session 1-à-1 avec un gestionnaire de compte pour optimiser votre flux de travail."
          action="Réserver un créneau"
          onClick={() => setIsAppointmentOpen(true)}
          color="secondary"
        />
      </div>

      {/* Active Tickets & FAQ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Tickets */}
        <TicketList
          tickets={tickets}
          onTicketSelect={handleTicketSelect}
        />

        {/* FAQ Quick Links */}
        <div className="lg:col-span-4">
          <h2 className="mb-3 text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
            Guides courants
          </h2>
          <div className="space-y-1.5">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="group flex items-center justify-between rounded-md border border-border bg-card px-3 py-2.5 transition-colors hover:bg-accent/40"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-[15px] text-muted-foreground" strokeWidth={1.75} />
                    <span className="text-[13px] font-medium text-foreground">{link.label}</span>
                  </div>
                  <ExternalLink className="size-3.5 text-muted-foreground/70 transition-colors group-hover:text-foreground" strokeWidth={1.75} />
                </a>
              )
            })}
          </div>

          <div className="mt-6 rounded-lg border border-border bg-card p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Besoin d&apos;une démo ?
            </p>
            <h4 className="mt-1 text-[14px] font-semibold text-foreground">
              Demandez une visite guidée
            </h4>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Un expert vous montre comment tirer le meilleur de LogePro.
            </p>
            <button
              onClick={() => setIsAppointmentOpen(true)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[12.5px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Planifier maintenant
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => {
          if (!selectedTicketId) {
            setIsNewTicketOpen(true)
          } else {
            setIsChatOpen(true)
          }
        }}
        aria-label="Ouvrir le chat support"
        className="fixed bottom-6 right-6 inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="size-5" strokeWidth={1.75} />
      </button>

      {/* Modals */}
      <LiveChat
        ticketId={selectedTicketId || ""}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      <NewTicketForm
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        onSubmit={handleCreateTicket}
      />

      <AppointmentForm
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        onSubmit={handleCreateAppointment}
      />
    </div>
  )
}
