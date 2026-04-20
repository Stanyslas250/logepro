"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { X } from "lucide-react"

const STATUS_TABS: { value: string; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "confirmed", label: "Confirmées" },
  { value: "pending", label: "En attente" },
  { value: "checked_in", label: "En cours" },
  { value: "checked_out", label: "Terminées" },
  { value: "cancelled", label: "Annulées" },
]

export function ReservationFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get("status") ?? "all"
  const currentRoomType = searchParams.get("room_type") ?? "all"
  const hasFilters = currentStatus !== "all" || currentRoomType !== "all"

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === "all") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      params.delete("page")
      const qs = params.toString()
      router.push(qs ? `/reservations?${qs}` : "/reservations")
    },
    [router, searchParams]
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex items-center rounded-md border border-border bg-card p-0.5">
        {STATUS_TABS.map((t) => {
          const active = currentStatus === t.value
          return (
            <button
              key={t.value}
              onClick={() => updateFilter("status", t.value)}
              className={`rounded px-2.5 py-1 text-[12px] font-medium transition-colors ${
                active
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <select
        value={currentRoomType}
        onChange={(e) => updateFilter("room_type", e.target.value)}
        className="h-8 rounded-md border border-border bg-card px-2.5 text-[12.5px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
      >
        <option value="all">Tous types</option>
        <option value="standard">Standard</option>
        <option value="suite">Suite</option>
        <option value="apartment">Appartement</option>
      </select>

      {hasFilters && (
        <button
          onClick={() => router.push("/reservations")}
          className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-[12px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="size-3.5" strokeWidth={1.75} />
          Réinitialiser
        </button>
      )}
    </div>
  )
}
