"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"
import type { Guest } from "@/types/database"
import { GuestTable } from "@/components/guests/GuestTable"
import { GuestFormModal } from "@/components/guests/GuestFormModal"
import { GuestDetail } from "@/components/guests/GuestDetail"

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [detailGuestId, setDetailGuestId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchGuests = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        per_page: "20",
      })
      
      const response = await fetch(`/api/guests?${params}`)
      if (response.ok) {
        const data = await response.json()
        setGuests(data.guests || [])
        setTotal(data.total || 0)
      }
    } catch (error) {
      console.error("Failed to fetch guests:", error)
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => {
    fetchGuests()
  }, [fetchGuests])

  const handleCreateGuest = async (guest: Omit<Guest, "id" | "created_at">) => {
    const response = await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(guest),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      console.error("Failed to create guest:", response.status, err)
      throw new Error(err.error ?? "Failed to create guest")
    }

    const data = await response.json()
    setGuests((prev) => [data.guest, ...prev])
    setTotal((prev) => prev + 1)
  }

  const handleUpdateGuest = async (guest: Omit<Guest, "id" | "created_at">) => {
    if (!selectedGuest) return

    try {
      const response = await fetch(`/api/guests/${selectedGuest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guest),
      })

      if (!response.ok) {
        throw new Error("Failed to update guest")
      }

      const data = await response.json()
      setGuests((prev) =>
        prev.map((g) => (g.id === selectedGuest.id ? data.guest : g))
      )
      setIsFormOpen(false)
      setSelectedGuest(null)
    } catch (error) {
      console.error("Failed to update guest:", error)
      throw error
    }
  }

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) return

    try {
      const response = await fetch(`/api/guests/${guestId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete guest")
      }

      setGuests((prev) => prev.filter((g) => g.id !== guestId))
      setTotal((prev) => prev - 1)
    } catch (error) {
      console.error("Failed to delete guest:", error)
      alert("Impossible de supprimer ce client. Vérifiez qu'il n'a pas de réservations actives.")
    }
  }

  const handleViewGuest = (guestId: string) => {
    setDetailGuestId(guestId)
    setIsDetailOpen(true)
  }

  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(guest)
    setIsFormOpen(true)
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Clients</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Gérez votre base clients et leur historique de réservations.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedGuest(null)
            setIsFormOpen(true)
          }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-[14px]" strokeWidth={2} />
          Ajouter un client
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-[14px] -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder="Rechercher par nom, email ou téléphone…"
          className="h-9 w-full rounded-md border border-border bg-card pl-8 pr-3 text-[13px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>

      {/* Table */}
      <GuestTable
        guests={guests}
        loading={loading}
        onView={handleViewGuest}
        onEdit={handleEditGuest}
        onDelete={handleDeleteGuest}
      />

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="size-4" strokeWidth={1.75} />
          </button>
          <span className="px-2 text-[11.5px] text-muted-foreground tabular-nums">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      )}

      {/* Modals */}
      <GuestFormModal
        isOpen={isFormOpen}
        guest={selectedGuest}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedGuest(null)
        }}
        onSubmit={selectedGuest ? handleUpdateGuest : handleCreateGuest}
      />

      {isDetailOpen && (
        <GuestDetail
          guestId={detailGuestId || ""}
          onClose={() => {
            setIsDetailOpen(false)
            setDetailGuestId(null)
          }}
          onEdit={handleEditGuest}
        />
      )}
    </div>
  )
}
