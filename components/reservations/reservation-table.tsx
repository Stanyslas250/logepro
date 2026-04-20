"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
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
  confirmed: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  pending: "border-amber-500/30 text-amber-600 dark:text-amber-400",
  cancelled: "border-destructive/30 text-destructive",
  checked_in: "border-primary/30 text-primary",
  checked_out: "border-border text-muted-foreground",
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
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              {["Client", "Chambre", "Séjour", "Statut", "Montant", ""].map((h, i) => (
                <th
                  key={i}
                  className={`px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground ${
                    i === 4 ? "text-right" : ""
                  } ${i === 5 ? "w-10" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => {
              const { range, nights } = formatDateRange(res.check_in, res.check_out)
              const initials = getInitials(res.guests?.full_name ?? "?")
              return (
                <tr
                  key={res.id}
                  className="group border-b border-border/60 transition-colors last:border-0 hover:bg-accent/40"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-[10.5px] font-semibold text-foreground">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-foreground">
                          {res.guests?.full_name ?? "—"}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {res.guests?.email ?? res.guests?.phone ?? ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <p className="text-[13px] text-foreground">
                      Ch. {res.rooms?.number ?? "—"}
                      <span className="ml-1 text-muted-foreground capitalize">
                        · {res.rooms?.type ?? "—"}
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Étage {res.rooms?.floor ?? "—"}
                    </p>
                  </td>
                  <td className="px-4 py-2.5">
                    <p className="text-[13px] tabular-nums text-foreground">{range}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {nights} nuit{nights > 1 ? "s" : ""}
                    </p>
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-medium ${
                        statusStyles[res.status] ??
                        "border-border text-muted-foreground"
                      }`}
                    >
                      {statusLabels[res.status] ?? res.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <p className="text-[13px] font-medium tabular-nums text-foreground">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "XAF",
                        maximumFractionDigits: 0,
                      }).format(res.total_amount)}
                    </p>
                  </td>
                  <td className="px-2 py-2.5 text-right">
                    <button
                      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-colors hover:bg-accent hover:text-foreground group-hover:opacity-100"
                      aria-label="Actions"
                    >
                      <MoreHorizontal className="size-4" strokeWidth={1.75} />
                    </button>
                  </td>
                </tr>
              )
            })}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <p className="text-[13px] text-muted-foreground">
                    Aucune réservation trouvée
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
        <p className="text-[11.5px] text-muted-foreground">
          {total > 0 ? `${start}–${end}` : "0"} sur {total}
        </p>
        <div className="flex items-center gap-0.5">
          <Link
            href={`/reservations?page=${Math.max(page - 1, 1)}`}
            aria-disabled={page <= 1}
            className={`inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors ${
              page <= 1
                ? "pointer-events-none opacity-40"
                : "hover:bg-accent hover:text-foreground"
            }`}
          >
            <ChevronLeft className="size-4" strokeWidth={1.75} />
          </Link>
          <span className="px-2 text-[11.5px] text-muted-foreground tabular-nums">
            {page} / {Math.max(totalPages, 1)}
          </span>
          <Link
            href={`/reservations?page=${Math.min(page + 1, Math.max(totalPages, 1))}`}
            aria-disabled={page >= totalPages}
            className={`inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors ${
              page >= totalPages
                ? "pointer-events-none opacity-40"
                : "hover:bg-accent hover:text-foreground"
            }`}
          >
            <ChevronRight className="size-4" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </div>
  )
}
