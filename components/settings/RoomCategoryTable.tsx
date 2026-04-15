"use client"

import { useState } from "react"
import type { RoomCategory } from "@/types/database"

interface RoomCategoryTableProps {
  categories: RoomCategory[]
  onEdit?: (category: RoomCategory) => void
  onDelete?: (categoryId: string) => void
  onAdd?: () => void
}

export function RoomCategoryTable({
  categories,
  onEdit,
  onDelete,
  onAdd,
}: RoomCategoryTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const getStatusBadge = (statusLabel: string) => {
    const baseStyles = "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
    
    switch (statusLabel.toLowerCase()) {
      case "vip elite":
        return `${baseStyles} bg-primary/10 text-primary border-primary/20`
      case "standard":
        return `${baseStyles} bg-tertiary/10 text-tertiary border-tertiary/20`
      default:
        return `${baseStyles} bg-secondary/10 text-secondary border-secondary/20`
    }
  }

  const formatPrice = (rate: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(rate)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="text-2xl font-bold">Catégories de chambres</h2>
          <p className="text-sm text-muted-foreground mt-1">Tarifs, capacité et regroupement par numéros.</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="px-6 py-2 bg-on-surface text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-colors"
        >
          Ajouter une catégorie
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-muted text-on-surface-variant text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-8 py-4">Catégorie</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Tarif / nuit</th>
              <th className="px-6 py-4">Capacité</th>
              <th className="px-6 py-4">N° chambres</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="hover:bg-muted transition-colors"
              >
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface">{category.name}</span>
                    {category.subtitle && (
                      <span className="text-xs text-slate-400">{category.subtitle}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className={getStatusBadge(category.status_label)}>
                    {category.status_label}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <span className="font-bold text-lg text-primary">
                    {formatPrice(category.base_rate)}
                    <span className="text-xs font-normal text-slate-400"> / nuit</span>
                  </span>
                </td>
                <td className="px-6 py-6 text-slate-600">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">person</span>
                    {category.capacity} {category.capacity <= 1 ? "personne" : "personnes"}
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex gap-1 flex-wrap">
                    {category.room_numbers.map((roomNumber) => (
                      <span
                        key={roomNumber}
                        className="bg-accent text-xs px-2 py-1 rounded"
                      >
                        {roomNumber}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className="text-slate-400 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {categories.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-muted-foreground">Aucune catégorie de chambre configurée</p>
          <button
            onClick={onAdd}
            className="mt-4 text-primary font-semibold hover:underline"
          >
            Créer la première catégorie
          </button>
        </div>
      )}

      {/* Dropdown menu for actions */}
      {selectedCategory && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setSelectedCategory(null)}
        >
          <div className="absolute top-0 right-0 mt-20 mr-8 bg-white rounded-lg shadow-lg border border-border py-2 min-w-[160px]">
            <button
              onClick={(e) => {
                e.stopPropagation()
                const category = categories.find((c) => c.id === selectedCategory)
                if (category && onEdit) onEdit(category)
                setSelectedCategory(null)
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
            >
              Modifier
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (onDelete) onDelete(selectedCategory)
                setSelectedCategory(null)
              }}
              className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/5 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
