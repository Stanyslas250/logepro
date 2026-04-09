"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { Guest, Room } from "@/types/database"
import { GuestSearch } from "./guest-search"

export function NewReservationForm() {
  const router = useRouter()

  // Guest
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)

  // Dates
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")

  // Room
  const [roomType, setRoomType] = useState("all")
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [adults, setAdults] = useState(2)
  const [loadingRooms, setLoadingRooms] = useState(false)

  // Notes
  const [notes, setNotes] = useState("")

  // Submission
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Fetch available rooms when dates or type change
  const fetchRooms = useCallback(async () => {
    if (!checkIn || !checkOut) return
    setLoadingRooms(true)
    try {
      const params = new URLSearchParams({ check_in: checkIn, check_out: checkOut })
      if (roomType !== "all") params.set("type", roomType)
      const res = await fetch(`/api/rooms/available?${params.toString()}`)
      const data = await res.json()
      setAvailableRooms(data.rooms ?? [])
    } catch {
      setAvailableRooms([])
    } finally {
      setLoadingRooms(false)
    }
  }, [checkIn, checkOut, roomType])

  useEffect(() => {
    if (checkIn && checkOut) {
      fetchRooms()
      setSelectedRoom(null)
    }
  }, [checkIn, checkOut, roomType, fetchRooms])

  // Compute summary
  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0

  const roomTotal = selectedRoom ? selectedRoom.rate * nights : 0
  const totalAmount = roomTotal

  const canSubmit =
    selectedGuest && selectedRoom && checkIn && checkOut && nights > 0 && !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_id: selectedGuest!.id,
          room_id: selectedRoom!.id,
          check_in: checkIn,
          check_out: checkOut,
          total_amount: totalAmount,
          notes: notes || null,
          source: "direct",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Erreur lors de la création")
        setSubmitting(false)
        return
      }

      router.push("/reservations")
      router.refresh()
    } catch {
      setError("Erreur de connexion")
      setSubmitting(false)
    }
  }

  // Group rooms by floor
  const floors = new Map<number, Room[]>()
  for (const room of availableRooms) {
    const existing = floors.get(room.floor) ?? []
    existing.push(room)
    floors.set(room.floor, existing)
  }

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Form Section */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
        {/* Guest Selection */}
        <section className="bg-card rounded-xl p-8 shadow-sm border border-border">
          <h3 className="text-xl font-bold font-heading flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">
              person_add
            </span>
            Information Client
          </h3>
          <GuestSearch
            selectedGuest={selectedGuest}
            onSelect={setSelectedGuest}
          />
        </section>

        {/* Dates & Room Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dates */}
          <section className="bg-card rounded-xl p-8 shadow-sm border border-border">
            <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                calendar_today
              </span>
              Dates du Séjour
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                  Check-In
                </label>
                <input
                  className="w-full p-3 rounded-lg border-none bg-muted focus:ring-2 focus:ring-primary/20"
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                  Check-Out
                </label>
                <input
                  className="w-full p-3 rounded-lg border-none bg-muted focus:ring-2 focus:ring-primary/20"
                  type="date"
                  value={checkOut}
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Room Selection */}
          <section className="bg-card rounded-xl p-8 shadow-sm border border-border">
            <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                bed
              </span>
              Sélection Chambre
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                  Type de Chambre
                </label>
                <select
                  className="w-full p-3 rounded-lg border-none bg-muted focus:ring-2 focus:ring-primary/20"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <option value="all">Tous les types</option>
                  <option value="standard">Standard</option>
                  <option value="suite">Suite</option>
                  <option value="apartment">Appartement</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                  Adultes
                </label>
                <input
                  className="w-full p-3 rounded-lg border-none bg-muted focus:ring-2 focus:ring-primary/20"
                  type="number"
                  min={1}
                  max={10}
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value, 10) || 1)}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Available Rooms Grid */}
        {checkIn && checkOut && (
          <section className="bg-card rounded-xl p-8 shadow-sm border border-border">
            <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                meeting_room
              </span>
              Chambres Disponibles
              <span className="text-xs font-medium text-muted-foreground ml-2">
                ({availableRooms.length} disponible{availableRooms.length !== 1 ? "s" : ""})
              </span>
            </h3>

            {loadingRooms && (
              <p className="text-sm text-muted-foreground">
                Chargement des chambres...
              </p>
            )}

            {!loadingRooms && availableRooms.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucune chambre disponible pour ces dates.
              </p>
            )}

            {!loadingRooms && availableRooms.length > 0 && (
              <div className="space-y-6">
                {[...floors.entries()]
                  .sort(([a], [b]) => a - b)
                  .map(([floor, floorRooms]) => (
                    <div key={floor}>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                        Étage {floor}
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {floorRooms
                          .filter((r) => r.capacity >= adults)
                          .map((room) => {
                            const isSelected = selectedRoom?.id === room.id
                            return (
                              <button
                                key={room.id}
                                onClick={() => setSelectedRoom(room)}
                                className={`p-3 rounded-xl border-2 text-center transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                    : "border-border hover:border-primary/30 bg-card"
                                }`}
                              >
                                <span className="font-mono text-lg font-bold block">
                                  {room.number}
                                </span>
                                <span className="text-[10px] text-muted-foreground capitalize block">
                                  {room.type}
                                </span>
                                <span className="text-xs font-semibold text-primary block mt-1">
                                  {new Intl.NumberFormat("fr-FR").format(room.rate)} /nuit
                                </span>
                              </button>
                            )
                          })}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        )}

        {/* Special Requests */}
        <section className="bg-card rounded-xl p-8 shadow-sm border border-border">
          <h3 className="text-sm font-bold font-heading mb-3">
            Demandes Spéciales
          </h3>
          <textarea
            className="w-full h-24 p-3 rounded-lg border-none bg-muted focus:ring-2 focus:ring-primary/20 text-sm"
            placeholder="Allergies, préférences d'étage, arrivée tardive..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>
      </div>

      {/* Summary Sidebar */}
      <div className="col-span-12 lg:col-span-4">
        <div className="sticky top-24 space-y-6">
          <div className="bg-primary p-8 rounded-2xl text-primary-foreground shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            <h3 className="text-lg font-bold font-heading mb-6 flex items-center justify-between relative z-10">
              Résumé de la Réservation
              <span className="material-symbols-outlined opacity-60">
                receipt_long
              </span>
            </h3>

            <div className="space-y-4 mb-8 relative z-10">
              {selectedGuest && (
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Client</span>
                  <span className="font-semibold">
                    {selectedGuest.full_name}
                  </span>
                </div>
              )}

              {selectedRoom && nights > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">
                    {selectedRoom.type} #{selectedRoom.number} ({nights} nuit
                    {nights > 1 ? "s" : ""})
                  </span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat("fr-FR").format(roomTotal)} FCFA
                  </span>
                </div>
              )}

              {!selectedRoom && (
                <p className="text-sm opacity-60 italic">
                  Sélectionnez une chambre pour voir le total
                </p>
              )}

              {totalAmount > 0 && (
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-60 font-bold mb-1">
                      Montant Total
                    </p>
                    <p className="text-3xl font-extrabold font-heading">
                      {new Intl.NumberFormat("fr-FR").format(totalAmount)}
                    </p>
                  </div>
                  <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold uppercase mb-2">
                    FCFA
                  </span>
                </div>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-200 bg-red-900/30 rounded-lg p-3 mb-4 relative z-10">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full bg-white text-primary py-4 rounded-xl font-bold tracking-tight shadow-lg hover:bg-white/90 transition-colors active:scale-95 duration-150 disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
            >
              {submitting ? "Création en cours..." : "Confirmer la Réservation"}
            </button>
            <p className="text-center text-[10px] mt-4 opacity-60 relative z-10">
              En confirmant, la réservation sera créée avec le statut
              &ldquo;confirmé&rdquo;.
            </p>
          </div>

          {/* Selected Room Info */}
          {selectedRoom && (
            <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-border">
              <div className="bg-primary/5 p-6">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Chambre Sélectionnée
                </span>
                <p className="text-lg font-bold font-heading mt-1">
                  {selectedRoom.type} {selectedRoom.number} — Étage{" "}
                  {selectedRoom.floor}
                </p>
              </div>
              <div className="p-4 flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    group
                  </span>
                  {selectedRoom.capacity} pers.
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    king_bed
                  </span>
                  <span className="capitalize">{selectedRoom.type}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    payments
                  </span>
                  {new Intl.NumberFormat("fr-FR").format(selectedRoom.rate)}/nuit
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
