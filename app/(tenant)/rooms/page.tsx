"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { BedDouble, Plus, X } from "lucide-react"
import type { Room, RoomType, RoomStatus } from "@/types/database"

const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "suite", label: "Suite" },
  { value: "apartment", label: "Appartement" },
]

const ROOM_STATUSES: { value: RoomStatus; label: string }[] = [
  { value: "available", label: "Disponible" },
  { value: "occupied", label: "Occupée" },
  { value: "cleaning", label: "Nettoyage" },
  { value: "maintenance", label: "Maintenance" },
]

const STATUS_STYLES: Record<string, string> = {
  available: "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400",
  occupied: "border-primary/30 bg-primary/5 text-primary",
  cleaning: "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400",
  maintenance: "border-destructive/30 bg-destructive/5 text-destructive",
}

const STATUS_DOT: Record<string, string> = {
  available: "bg-emerald-500",
  occupied: "bg-primary",
  cleaning: "bg-amber-500",
  maintenance: "bg-destructive",
}

const STATUS_LABELS: Record<string, string> = {
  available: "Disponible",
  occupied: "Occupée",
  cleaning: "Nettoyage",
  maintenance: "Maintenance",
}

const TYPE_LABELS: Record<string, string> = {
  standard: "Standard",
  suite: "Suite",
  apartment: "Appartement",
}

async function apiMessage(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as { error?: string; details?: string }
    return j.details || j.error || `Erreur ${res.status}`
  } catch {
    return `Erreur ${res.status}`
  }
}

const labelClass = "block text-[12px] font-medium text-foreground mb-1"
const inputClass =
  "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-ring/30"

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [banner, setBanner] = useState<{ type: "error" | "ok"; text: string } | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

  const [filterFloor, setFilterFloor] = useState<number | "all">("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const fetchRooms = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/rooms")
      if (res.ok) {
        const data = await res.json()
        setRooms(data.rooms ?? [])
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const showError = (msg: string) => {
    setBanner({ type: "error", text: msg })
    setTimeout(() => setBanner(null), 6000)
  }

  const showOk = (msg: string) => {
    setBanner({ type: "ok", text: msg })
    setTimeout(() => setBanner(null), 4000)
  }

  const floors = useMemo(() => {
    const set = new Set(rooms.map((r) => r.floor))
    return [...set].sort((a, b) => a - b)
  }, [rooms])

  const filteredRooms = useMemo(() => {
    let result = rooms
    if (filterFloor !== "all") {
      result = result.filter((r) => r.floor === filterFloor)
    }
    if (filterStatus !== "all") {
      result = result.filter((r) => r.status === filterStatus)
    }
    return result
  }, [rooms, filterFloor, filterStatus])

  const roomsByFloor = useMemo(() => {
    const map = new Map<number, Room[]>()
    for (const room of filteredRooms) {
      const arr = map.get(room.floor) ?? []
      arr.push(room)
      map.set(room.floor, arr)
    }
    return [...map.entries()].sort(([a], [b]) => a - b)
  }, [filteredRooms])

  const handleAdd = () => {
    setEditingRoom(null)
    setModalOpen(true)
  }

  const handleEdit = (room: Room) => {
    setEditingRoom(room)
    setModalOpen(true)
  }

  const handleDelete = async (room: Room) => {
    if (!window.confirm(`Supprimer la chambre « ${room.number} » ?`)) return
    const res = await fetch(`/api/rooms/${room.id}`, { method: "DELETE" })
    if (!res.ok) {
      showError(await apiMessage(res))
      return
    }
    setRooms((prev) => prev.filter((r) => r.id !== room.id))
    showOk("Chambre supprimée.")
  }

  const handleSave = async (payload: {
    number: string
    floor: number
    type: RoomType
    capacity: number
    rate: number
    status: RoomStatus
  }) => {
    if (editingRoom) {
      const res = await fetch(`/api/rooms/${editingRoom.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const msg = await apiMessage(res)
        showError(msg)
        throw new Error(msg)
      }
      const { room } = (await res.json()) as { room: Room }
      setRooms((prev) => prev.map((r) => (r.id === room.id ? room : r)))
      showOk("Chambre mise à jour.")
    } else {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const msg = await apiMessage(res)
        showError(msg)
        throw new Error(msg)
      }
      const { room } = (await res.json()) as { room: Room }
      setRooms((prev) =>
        [...prev, room].sort((a, b) => a.floor - b.floor || a.number.localeCompare(b.number, undefined, { numeric: true }))
      )
      showOk("Chambre créée.")
    }
  }

  const stats = useMemo(() => {
    const total = rooms.length
    const available = rooms.filter((r) => r.status === "available").length
    const occupied = rooms.filter((r) => r.status === "occupied").length
    const cleaning = rooms.filter((r) => r.status === "cleaning").length
    const maintenance = rooms.filter((r) => r.status === "maintenance").length
    return { total, available, occupied, cleaning, maintenance }
  }, [rooms])

  return (
    <div className="space-y-5">
      {banner && (
        <div
          className={`rounded-md border px-3 py-2 text-[12.5px] ${
            banner.type === "error"
              ? "border-destructive/20 bg-destructive/10 text-destructive"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
          }`}
        >
          {banner.text}
        </div>
      )}

      <RoomFormModal
        open={modalOpen}
        room={editingRoom}
        defaultFloor={filterFloor !== "all" ? filterFloor : floors[0] ?? 0}
        onClose={() => {
          setModalOpen(false)
          setEditingRoom(null)
        }}
        onSave={handleSave}
      />

      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Chambres</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {stats.total} chambres — {stats.available} disponible{stats.available > 1 ? "s" : ""}, {stats.occupied} occupée{stats.occupied > 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-[14px]" strokeWidth={2} />
          Ajouter une chambre
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {([
          { label: "Disponibles", value: stats.available, dot: "bg-emerald-500" },
          { label: "Occupées", value: stats.occupied, dot: "bg-primary" },
          { label: "Nettoyage", value: stats.cleaning, dot: "bg-amber-500" },
          { label: "Maintenance", value: stats.maintenance, dot: "bg-destructive" },
        ] as const).map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-center gap-1.5">
              <span className={`size-1.5 rounded-full ${s.dot}`} />
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
            </div>
            <p className="text-[24px] font-semibold leading-none tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filterFloor === "all" ? "all" : String(filterFloor)}
          onChange={(e) =>
            setFilterFloor(e.target.value === "all" ? "all" : parseInt(e.target.value, 10))
          }
          className="h-8 rounded-md border border-border bg-card px-2.5 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-ring/30"
        >
          <option value="all">Tous les étages</option>
          {floors.map((f) => (
            <option key={f} value={f}>Étage {f}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-8 rounded-md border border-border bg-card px-2.5 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-ring/30"
        >
          <option value="all">Tous les statuts</option>
          {ROOM_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Room grid grouped by floor */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          Chargement…
        </div>
      ) : roomsByFloor.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-12 py-16 text-center">
          <BedDouble className="size-8 text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-3 text-[14px] font-medium text-foreground">Aucune chambre configurée</p>
          <p className="mt-1 max-w-md text-[12.5px] text-muted-foreground">
            Ajoutez vos chambres pour les voir apparaître ici et dans le plan des étages (Paramètres).
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground"
          >
            <Plus className="size-[14px]" strokeWidth={2} />
            Créer la première chambre
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {roomsByFloor.map(([floor, floorRooms]) => (
            <div key={floor}>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-[13px] font-medium text-foreground">Étage {floor}</h2>
                <span className="rounded-full border border-border px-1.5 py-0.5 text-[10.5px] text-muted-foreground">
                  {floorRooms.length} chambre{floorRooms.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {floorRooms.map((room) => (
                  <div
                    key={room.id}
                    className="group relative flex cursor-pointer flex-col rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent/40"
                    onClick={() => handleEdit(room)}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[15px] font-semibold tracking-tight text-foreground">{room.number}</span>
                      <span className={`size-1.5 rounded-full ${STATUS_DOT[room.status] ?? "bg-muted-foreground"}`} />
                    </div>
                    <span className="mt-1 text-[11.5px] text-muted-foreground">{TYPE_LABELS[room.type] ?? room.type}</span>
                    <span className={`mt-0.5 text-[10.5px] ${STATUS_STYLES[room.status] ?? "text-muted-foreground"}`}>
                      {STATUS_LABELS[room.status] ?? room.status}
                    </span>
                    <span className="mt-2 text-[10.5px] text-muted-foreground">
                      {room.capacity} pers · {room.rate.toLocaleString("fr-FR")} €
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(room)
                      }}
                      className="absolute right-1 top-1 inline-flex size-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                      aria-label="Supprimer"
                    >
                      <X className="size-3.5" strokeWidth={1.75} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function RoomFormModal({
  open,
  room,
  defaultFloor,
  onClose,
  onSave,
}: {
  open: boolean
  room: Room | null
  defaultFloor: number
  onClose: () => void
  onSave: (payload: {
    number: string
    floor: number
    type: RoomType
    capacity: number
    rate: number
    status: RoomStatus
  }) => Promise<void>
}) {
  const [number, setNumber] = useState("")
  const [floor, setFloor] = useState(0)
  const [type, setType] = useState<RoomType>("standard")
  const [capacity, setCapacity] = useState(2)
  const [rate, setRate] = useState(0)
  const [status, setStatus] = useState<RoomStatus>("available")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (room) {
      setNumber(room.number)
      setFloor(room.floor)
      setType(room.type)
      setCapacity(room.capacity)
      setRate(room.rate)
      setStatus(room.status)
    } else {
      setNumber("")
      setFloor(defaultFloor)
      setType("standard")
      setCapacity(2)
      setRate(0)
      setStatus("available")
    }
  }, [room, open, defaultFloor])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!number.trim()) return
    setSaving(true)
    try {
      await onSave({ number: number.trim(), floor, type, capacity, rate, status })
      onClose()
    } catch {
      /* erreur affichée par le parent */
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h2 className="text-[15px] font-semibold text-foreground">
            {room ? "Modifier la chambre" : "Nouvelle chambre"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Fermer"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="room-number">
                Numéro
              </label>
              <input
                id="room-number"
                className={inputClass}
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="101"
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="room-floor">
                Étage
              </label>
              <input
                id="room-floor"
                type="number"
                className={inputClass}
                value={floor}
                onChange={(e) => setFloor(parseInt(e.target.value, 10) || 0)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="room-type">
                Type
              </label>
              <select
                id="room-type"
                className={inputClass}
                value={type}
                onChange={(e) => setType(e.target.value as RoomType)}
              >
                {ROOM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="room-status">
                Statut
              </label>
              <select
                id="room-status"
                className={inputClass}
                value={status}
                onChange={(e) => setStatus(e.target.value as RoomStatus)}
              >
                {ROOM_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="room-capacity">
                Capacité (personnes)
              </label>
              <input
                id="room-capacity"
                type="number"
                min={1}
                className={inputClass}
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 1)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="room-rate">
                Tarif / nuit (EUR)
              </label>
              <input
                id="room-rate"
                type="number"
                min={0}
                className={inputClass}
                value={rate}
                onChange={(e) => setRate(parseInt(e.target.value, 10) || 0)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-md border border-border px-3 py-1.5 text-[13px] transition-colors hover:bg-accent">
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
