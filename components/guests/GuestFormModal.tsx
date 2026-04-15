"use client"

import { useState, useEffect } from "react"
import type { Guest } from "@/types/database"

interface GuestFormModalProps {
  isOpen: boolean
  guest?: Guest | null
  onClose: () => void
  onSubmit: (guest: Omit<Guest, "id" | "created_at">) => Promise<void>
}

export function GuestFormModal({
  isOpen,
  guest,
  onClose,
  onSubmit,
}: GuestFormModalProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    id_type: "",
    id_number: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (guest) {
      setFormData({
        full_name: guest.full_name,
        phone: guest.phone || "",
        email: guest.email || "",
        id_type: guest.id_type || "",
        id_number: guest.id_number || "",
        notes: guest.notes || "",
      })
    } else {
      setFormData({
        full_name: "",
        phone: "",
        email: "",
        id_type: "",
        id_number: "",
        notes: "",
      })
    }
  }, [guest, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.full_name.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        id_type: formData.id_type || null,
        id_number: formData.id_number.trim() || null,
        notes: formData.notes.trim() || null,
      })
      onClose()
    } catch (error) {
      console.error("Failed to save guest:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">
            {guest ? "Modifier le client" : "Ajouter un client"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-on-surface"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nom complet <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Jean Dupont"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jean.dupont@example.com"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Téléphone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+33 6 12 34 56 78"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type de pièce d&apos;identité</label>
              <select
                value={formData.id_type}
                onChange={(e) => setFormData({ ...formData, id_type: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Sélectionner...</option>
                <option value="passport">Passeport</option>
                <option value="id_card">Carte d&apos;identité</option>
                <option value="driver_license">Permis de conduire</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Numéro de pièce</label>
              <input
                type="text"
                value={formData.id_number}
                onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                placeholder="123456789"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Informations supplémentaires sur le client..."
              rows={3}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-surface-container-low transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!formData.full_name.trim() || isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Enregistrement..." : guest ? "Mettre à jour" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
