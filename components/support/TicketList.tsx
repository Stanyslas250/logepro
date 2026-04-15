"use client"

import { useState } from "react"
import type { SupportTicket } from "@/types/database"

interface TicketListProps {
  tickets: SupportTicket[]
  onTicketSelect?: (ticketId: string) => void
  onRefresh?: () => void
}

export function TicketList({ tickets, onTicketSelect, onRefresh }: TicketListProps) {
  const [filter, setFilter] = useState<string>("all")

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "all") return true
    return ticket.status === filter
  })

  const getStatusBadge = (status: string) => {
    const baseStyles = "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
    
    switch (status) {
      case "open":
        return `${baseStyles} bg-secondary-container text-on-secondary-container`
      case "in_progress":
        return `${baseStyles} bg-primary-container text-on-primary-container`
      case "resolved":
        return `${baseStyles} bg-tertiary-container text-on-tertiary-container`
      case "closed":
        return `${baseStyles} bg-accent text-muted-foreground`
      default:
        return baseStyles
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return "priority_high"
      case "medium":
        return "remove"
      case "low":
        return "priority_low"
      default:
        return "remove"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-destructive"
      case "medium":
        return "text-amber-600"
      case "low":
        return "text-tertiary"
      default:
        return "text-muted-foreground"
    }
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const diffInHours = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "1d ago"
    return `${diffInDays}d ago`
  }

  const filters = [
    { value: "all", label: "All Tickets" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
  ]

  return (
    <div className="lg:col-span-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Active Tickets</h2>
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background"
          >
            {filters.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <button
            onClick={onRefresh}
            className="text-sm font-semibold text-primary hover:underline"
          >
            View History
          </button>
        </div>
      </div>

      <div className="bg-card rounded-3xl overflow-hidden shadow-sm">
        {filteredTickets.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted transition-colors cursor-pointer"
                onClick={() => onTicketSelect?.(ticket.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container shrink-0">
                    <span className="material-symbols-outlined text-lg">
                      {ticket.priority === "high" ? "bug_report" : "help"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-on-surface">{ticket.subject}</p>
                    <p className="text-xs text-on-surface-variant">
                      Ticket #{ticket.ticket_number} • Updated {formatTimeAgo(ticket.updated_at)}
                    </p>
                  </div>
                  <span
                    className={`material-symbols-outlined ${getPriorityColor(ticket.priority)}`}
                    title={`Priority: ${ticket.priority}`}
                  >
                    {getPriorityIcon(ticket.priority)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={getStatusBadge(ticket.status)}>
                    {ticket.status.replace("_", " ")}
                  </span>
                  <button className="h-10 w-10 flex items-center justify-center rounded-full bg-accent text-muted-foreground hover:bg-accent/80 transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-muted-foreground">
              confirmation_number
            </span>
            <p className="mt-4 text-muted-foreground">
              {filter === "all" ? "No tickets yet" : `No ${filter} tickets`}
            </p>
            <button className="mt-4 text-primary font-semibold hover:underline">
              Create your first ticket
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
