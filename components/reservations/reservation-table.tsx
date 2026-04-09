"use client"

import Link from "next/link"
import type { Reservation, Room, Guest } from "@/types/database"

type ReservationWithJoins = Reservation & {
  rooms: Room
  guests: Guest
}

interface ReservationTableProps {
  reservations: ReservationWithJoins[]
  total: number
  page: number
  perPage: number
}

const statusStyles: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-600",
  checked_in: "bg-primary/10 text-primary",
  checked_out: "bg-muted text-muted-foreground",
}

const statusLabels: Record<string, string> = {
  confirmed: "Confirmé",
  pending: "En attente",
  cancelled: "Annulé",
  checked_in: "Séjour en cours",
  checked_out: "Terminé",
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2)
}

function formatDateRange(checkIn: string, checkOut: string) {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const nights = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  )
  const fmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" })
  return {
    range: `${fmt.format(start)} — ${fmt.format(end)}`,
    nights,
  }
}

export function ReservationTable({
  reservations,
  total,
  page,
  perPage,
}: ReservationTableProps) {
  const totalPages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage + 1
  const end = Math.min(page * perPage, total)

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold font-heading">
            Liste des Réservations
          </h3>
          <span className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-[10px] font-bold">
            {total} TOTAL
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Client
              </th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Chambre
              </th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Dates de Séjour
              </th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Statut
              </th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Prix Total
              </th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reservations.map((res) => {
              const { range, nights } = formatDateRange(res.check_in, res.check_out)
              const initials = getInitials(res.guests?.full_name ?? "?")
              return (
                <tr
                  key={res.id}
                  className="group hover:bg-accent/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {res.guests?.full_name ?? "—"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {res.guests?.email ?? res.guests?.phone ?? ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">
                      {res.rooms?.type ?? "—"} {res.rooms?.number ?? ""}
                    </p>
                    <p className="text-[11px] text-muted-foreground capitalize">
                      Étage {res.rooms?.floor ?? "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{range}</span>
                      <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">
                        {nights} Nuit{nights > 1 ? "s" : ""}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        statusStyles[res.status] ?? "bg-muted text-muted-foreground"
                      }`}
                    >
                      {statusLabels[res.status] ?? res.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "XAF",
                        maximumFractionDigits: 0,
                      }).format(res.total_amount)}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
              )
            })}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <p className="text-muted-foreground text-sm">
                    Aucune réservation trouvée
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          Affichage de {total > 0 ? start : 0}-{end} sur {total} réservations
        </p>
        <div className="flex gap-1">
          {page > 1 && (
            <Link
              href={`/reservations?page=${page - 1}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-card text-muted-foreground transition-colors"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </Link>
          )}
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNum = i + 1
            return (
              <Link
                key={pageNum}
                href={`/reservations?page=${pageNum}`}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                  pageNum === page
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-card text-foreground"
                }`}
              >
                {pageNum}
              </Link>
            )
          })}
          {page < totalPages && (
            <Link
              href={`/reservations?page=${page + 1}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-card text-muted-foreground transition-colors"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
