"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export function ReservationFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get("status") ?? "all"
  const currentRoomType = searchParams.get("room_type") ?? "all"

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === "all") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      params.delete("page")
      router.push(`/reservations?${params.toString()}`)
    },
    [router, searchParams]
  )

  const resetFilters = useCallback(() => {
    router.push("/reservations")
  }, [router])

  return (
    <div className="bg-card p-6 rounded-xl border border-border space-y-4">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
        Filtres Actifs
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-2">
            Statut
          </label>
          <select
            value={currentStatus}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="w-full bg-muted border-none rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary/10"
          >
            <option value="all">Tous les statuts</option>
            <option value="confirmed">Confirmé</option>
            <option value="pending">En attente</option>
            <option value="checked_in">Séjour en cours</option>
            <option value="checked_out">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-2">
            Type de Chambre
          </label>
          <select
            value={currentRoomType}
            onChange={(e) => updateFilter("room_type", e.target.value)}
            className="w-full bg-muted border-none rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary/10"
          >
            <option value="all">Tous types</option>
            <option value="standard">Standard</option>
            <option value="suite">Suite</option>
            <option value="apartment">Appartement</option>
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="w-full py-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors border border-primary/20"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  )
}
