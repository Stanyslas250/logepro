"use client"

import { useState, useEffect, useCallback } from "react"
import type { Guest, Reservation } from "@/types/database"

interface GuestDetailProps {
  guestId: string
  onClose: () => void
  onEdit?: (guest: Guest) => void
}

export function GuestDetail({ guestId, onClose, onEdit }: GuestDetailProps) {
  const [guest, setGuest] = useState<Guest | null>(null)
  const [reservations, setReservations] = useState<(Reservation & { rooms: unknown })[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGuestDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/guests/${guestId}`)
      if (response.ok) {
        const data = await response.json()
        setGuest(data.guest)
        setReservations(data.reservations)
      }
    } catch (error) {
      console.error("Failed to fetch guest details:", error)
    } finally {
      setLoading(false)
    }
  }, [guestId])

  useEffect(() => {
    fetchGuestDetails()
  }, [fetchGuestDetails])

  const getStatusBadge = (status: string) => {
    const baseStyles = "px-3 py-1 rounded-full text-xs font-bold uppercase"
    
    switch (status) {
      case "pending":
        return `${baseStyles} bg-secondary-container text-on-secondary-container`
      case "confirmed":
        return `${baseStyles} bg-primary-container text-on-primary-container`
      case "checked_in":
        return `${baseStyles} bg-tertiary-container text-on-tertiary-container`
      case "checked_out":
      case "cancelled":
        return `${baseStyles} bg-surface-container-high text-muted-foreground`
      default:
        return baseStyles
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!guest) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8 text-center">
          <span className="material-symbols-outlined text-6xl text-muted-foreground">
            error
          </span>
          <p className="mt-4 text-muted-foreground">Client non trouvé</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Fermer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">
                person
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{guest.full_name}</h2>
              <p className="text-sm text-muted-foreground">Client ID: {guest.id.slice(0, 8)}...</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit?.(guest)}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Informations de contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-muted-foreground">email</span>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{guest.email || "Non renseigné"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-muted-foreground">phone</span>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{guest.phone || "Non renseigné"}</p>
                </div>
              </div>
              {guest.id_type && (
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-muted-foreground">badge</span>
                  <div>
                    <p className="text-sm text-muted-foreground">Pièce d&apos;identité</p>
                    <p className="font-medium">
                      {guest.id_type} {guest.id_number && `••••${guest.id_number.slice(-4)}`}
                    </p>
                  </div>
                </div>
              )}
              {guest.notes && (
                <div className="flex items-start gap-3 md:col-span-2">
                  <span className="material-symbols-outlined text-muted-foreground">note</span>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium">{guest.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reservations History */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Historique des réservations</h3>
            {reservations.length > 0 ? (
              <div className="space-y-3">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="border border-border rounded-lg p-4 hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          Chambre {reservation.rooms?.number || "N/A"} - {reservation.rooms?.type || "Standard"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(reservation.check_in)} - {formatDate(reservation.check_out)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={getStatusBadge(reservation.status)}>
                          {reservation.status.replace("_", " ")}
                        </span>
                        <p className="text-sm font-medium text-primary mt-1">
                          {formatPrice(reservation.total_amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <span className="material-symbols-outlined text-4xl">booking_history</span>
                <p className="mt-2">Aucune réservation</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-border rounded-lg hover:bg-surface-container-low transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
