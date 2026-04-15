"use client"

import { useState, useEffect, useCallback } from "react"
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
    <div className="max-w-7xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Gérez votre base de données clients et leur historique de réservations.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedGuest(null)
            setIsFormOpen(true)
          }}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          Ajouter un client
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Rechercher par nom, email ou téléphone..."
            className="w-full pl-12 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
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
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1
              const isActive = pageNum === page
              
              if (totalPages > 5 && i === 4) {
                return (
                  <span key="dots" className="px-2 text-muted-foreground">
                    ...
                  </span>
                )
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
          
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">chevron_right</span>
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
