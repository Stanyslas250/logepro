"use client"

import { useState, useEffect } from "react"
import type { HotelFloor, RoomCategory, Service, ServiceCategory } from "@/types/database"

function ModalFrame({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-on-surface">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
            aria-label="Fermer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

const labelClass = "block text-sm font-medium text-on-surface mb-1"
const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"

export function FloorModal({
  open,
  floor,
  onClose,
  onSave,
}: {
  open: boolean
  floor: HotelFloor | null
  onClose: () => void
  onSave: (payload: { name: string; floor_number: number }) => Promise<void>
}) {
  const [name, setName] = useState("")
  const [floorNumber, setFloorNumber] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (floor) {
      setName(floor.name)
      setFloorNumber(floor.floor_number)
    } else {
      setName("")
      setFloorNumber(0)
    }
  }, [floor, open])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await onSave({
        name: name.trim(),
        floor_number: floorNumber,
      })
      onClose()
    } catch {
      /* Erreur affichée par le parent */
    } finally {
      setSaving(false)
    }
  }

  return (
    <ModalFrame title={floor ? "Modifier l’étage" : "Ajouter un étage"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="floor-name">
            Nom de l’étage
          </label>
          <input
            id="floor-name"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex. Rez-de-chaussée, 1er étage"
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="floor-num">
            Numéro d’étage
          </label>
          <input
            id="floor-num"
            type="number"
            className={inputClass}
            value={floorNumber}
            onChange={(e) => setFloorNumber(parseInt(e.target.value, 10) || 0)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Doit correspondre au champ « étage » des enregistrements chambres en base.
          </p>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm hover:bg-muted">
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground font-medium disabled:opacity-50"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>
    </ModalFrame>
  )
}

export function RoomCategoryModal({
  open,
  category,
  onClose,
  onSave,
}: {
  open: boolean
  category: RoomCategory | null
  onClose: () => void
  onSave: (payload: {
    name: string
    subtitle: string | null
    status_label: string
    base_rate: number
    capacity: number
    room_numbers: string[]
  }) => Promise<void>
}) {
  const [name, setName] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [statusLabel, setStatusLabel] = useState("Standard")
  const [baseRate, setBaseRate] = useState(0)
  const [capacity, setCapacity] = useState(2)
  const [roomNumbersRaw, setRoomNumbersRaw] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (category) {
      setName(category.name)
      setSubtitle(category.subtitle ?? "")
      setStatusLabel(category.status_label)
      setBaseRate(category.base_rate)
      setCapacity(category.capacity)
      setRoomNumbersRaw(category.room_numbers.join(", "))
    } else {
      setName("")
      setSubtitle("")
      setStatusLabel("Standard")
      setBaseRate(0)
      setCapacity(2)
      setRoomNumbersRaw("")
    }
  }, [category, open])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !statusLabel.trim()) return
    const room_numbers = roomNumbersRaw
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    setSaving(true)
    try {
      await onSave({
        name: name.trim(),
        subtitle: subtitle.trim() || null,
        status_label: statusLabel.trim(),
        base_rate: baseRate,
        capacity,
        room_numbers,
      })
      onClose()
    } catch {
      /* Erreur affichée par le parent */
    } finally {
      setSaving(false)
    }
  }

  return (
    <ModalFrame
      title={category ? "Modifier la catégorie" : "Nouvelle catégorie de chambre"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="cat-name">
            Nom
          </label>
          <input
            id="cat-name"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="cat-sub">
            Sous-titre (optionnel)
          </label>
          <input
            id="cat-sub"
            className={inputClass}
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="cat-status">
            Libellé statut (ex. Standard, VIP)
          </label>
          <input
            id="cat-status"
            className={inputClass}
            value={statusLabel}
            onChange={(e) => setStatusLabel(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="cat-rate">
              Tarif de base / nuit (EUR)
            </label>
            <input
              id="cat-rate"
              type="number"
              min={0}
              className={inputClass}
              value={baseRate}
              onChange={(e) => setBaseRate(parseInt(e.target.value, 10) || 0)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="cat-cap">
              Capacité (personnes)
            </label>
            <input
              id="cat-cap"
              type="number"
              min={1}
              className={inputClass}
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 1)}
            />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="cat-rooms">
            Numéros de chambres (séparés par des virgules)
          </label>
          <input
            id="cat-rooms"
            className={inputClass}
            value={roomNumbersRaw}
            onChange={(e) => setRoomNumbersRaw(e.target.value)}
            placeholder="101, 102, 103"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm hover:bg-muted">
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground font-medium disabled:opacity-50"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>
    </ModalFrame>
  )
}

const SERVICE_CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: "wellness", label: "Bien-être" },
  { value: "logistics", label: "Logistique" },
  { value: "gastronomy", label: "Gastronomie" },
]

export function ServiceModal({
  open,
  service,
  onClose,
  onSave,
}: {
  open: boolean
  service: Service | null
  onClose: () => void
  onSave: (payload: {
    name: string
    category: ServiceCategory
    description: string
    price_label: string
    image_url: string | null
    is_available: boolean
  }) => Promise<void>
}) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState<ServiceCategory>("wellness")
  const [description, setDescription] = useState("")
  const [priceLabel, setPriceLabel] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isAvailable, setIsAvailable] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (service) {
      setName(service.name)
      setCategory(service.category)
      setDescription(service.description)
      setPriceLabel(service.price_label)
      setImageUrl(service.image_url ?? "")
      setIsAvailable(service.is_available)
    } else {
      setName("")
      setCategory("wellness")
      setDescription("")
      setPriceLabel("")
      setImageUrl("")
      setIsAvailable(true)
    }
  }, [service, open])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !description.trim() || !priceLabel.trim()) return
    setSaving(true)
    try {
      await onSave({
        name: name.trim(),
        category,
        description: description.trim(),
        price_label: priceLabel.trim(),
        image_url: imageUrl.trim() || null,
        is_available: isAvailable,
      })
      onClose()
    } catch {
      /* Erreur affichée par le parent */
    } finally {
      setSaving(false)
    }
  }

  return (
    <ModalFrame title={service ? "Modifier le service" : "Nouveau service"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="svc-name">
            Nom
          </label>
          <input
            id="svc-name"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="svc-cat">
            Catégorie
          </label>
          <select
            id="svc-cat"
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value as ServiceCategory)}
          >
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="svc-desc">
            Description
          </label>
          <textarea
            id="svc-desc"
            className={`${inputClass} min-h-[100px] resize-y`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="svc-price">
            Prix (texte libre)
          </label>
          <input
            id="svc-price"
            className={inputClass}
            value={priceLabel}
            onChange={(e) => setPriceLabel(e.target.value)}
            placeholder="Ex. 45 € / séance"
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="svc-img">
            URL de l’image (optionnel)
          </label>
          <input
            id="svc-img"
            type="url"
            className={inputClass}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            className="rounded border-border"
          />
          <span className="text-sm">Disponible à la réservation</span>
        </label>
        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm hover:bg-muted">
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground font-medium disabled:opacity-50"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>
    </ModalFrame>
  )
}
