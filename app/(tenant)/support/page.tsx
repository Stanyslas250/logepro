"use client"

import { useState, useEffect } from "react"
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

  const quickLinks = [
    { icon: "payments", label: "Facturation & Paiements", href: "#" },
    { icon: "rocket_launch", label: "Configuration du compte", href: "#" },
    { icon: "group", label: "Permissions du personnel", href: "#" },
    { icon: "terminal", label: "Documentation développeur", href: "#" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
          <h2 className="text-2xl font-bold mb-6">Guides courants</h2>
          <div className="space-y-4">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center justify-between p-5 bg-muted rounded-2xl hover:bg-accent transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">
                    {link.icon}
                  </span>
                  <span className="font-bold">{link.label}</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
                  open_in_new
                </span>
              </a>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-br from-blue-900 to-blue-700 rounded-[2rem] text-white">
            <p className="text-sm font-semibold opacity-80 mb-2">Besoin d&apos;une démo ?</p>
            <h4 className="text-xl font-bold mb-4">Demandez une visite guidée des fonctionnalités</h4>
            <button
              onClick={() => setIsAppointmentOpen(true)}
              className="w-full py-3 bg-white text-blue-900 rounded-xl font-bold text-sm shadow-xl hover:bg-blue-50 transition-colors"
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
        className="fixed bottom-8 right-8 h-16 w-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          forum
        </span>
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
