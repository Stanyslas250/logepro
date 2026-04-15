"use client"

import { useState } from "react"
import type { Guest } from "@/types/database"

interface GuestTableProps {
  guests: Guest[]
  loading?: boolean
  onEdit?: (guest: Guest) => void
  onDelete?: (guestId: string) => void
  onView?: (guestId: string) => void
}

export function GuestTable({
  guests,
  loading,
  onEdit,
  onDelete,
  onView,
}: GuestTableProps) {
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getIdTypeLabel = (type: string | null) => {
    if (!type) return "N/A"
    switch (type) {
      case "passport":
        return "Passeport"
      case "id_card":
        return "Carte d'identité"
      case "driver_license":
        return "Permis de conduire"
      default:
        return type
    }
  }

  return (
    <div className="bg-surface rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold">Clients</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low text-on-surface-variant text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Nom</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Téléphone</th>
              <th className="px-6 py-4">Pièce d&apos;identité</th>
              <th className="px-6 py-4">Date de création</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="inline-flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-muted-foreground">Chargement...</span>
                  </div>
                </td>
              </tr>
            ) : guests.length > 0 ? (
              guests.map((guest) => (
                <tr
                  key={guest.id}
                  className="hover:bg-surface-bright transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">
                          person
                        </span>
                      </div>
                      <span className="font-medium">{guest.full_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {guest.email || "—"}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {guest.phone || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {getIdTypeLabel(guest.id_type)}
                      </span>
                      {guest.id_number && (
                        <span className="text-xs text-muted-foreground">
                          ••••{guest.id_number.slice(-4)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {formatDate(guest.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedGuest(guest.id)}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <span className="material-symbols-outlined text-6xl text-muted-foreground">
                    group_off
                  </span>
                  <p className="mt-4 text-muted-foreground">Aucun client trouvé</p>
                  <p className="text-sm text-muted-foreground">
                    Utilisez le bouton &quot;Ajouter un client&quot; pour commencer
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dropdown menu for actions */}
      {selectedGuest && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setSelectedGuest(null)}
        >
          <div className="absolute top-0 right-0 mt-20 mr-8 bg-surface rounded-lg shadow-lg border border-border py-2 min-w-[160px]">
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (onView) onView(selectedGuest)
                setSelectedGuest(null)
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-surface-container-low transition-colors"
            >
              Voir les détails
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                const guest = guests.find((g) => g.id === selectedGuest)
                if (guest && onEdit) onEdit(guest)
                setSelectedGuest(null)
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-surface-container-low transition-colors"
            >
              Modifier
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (onDelete) onDelete(selectedGuest)
                setSelectedGuest(null)
              }}
              className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/5 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
