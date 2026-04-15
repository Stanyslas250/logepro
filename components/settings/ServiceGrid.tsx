"use client"

import { useState } from "react"
import type { Service } from "@/types/database"
import { ServiceCard } from "./ServiceCard"

interface ServiceGridProps {
  services: Service[]
  onEdit?: (service: Service) => void
  onAdd?: () => void
  onUpdate?: (serviceId: string, updates: Partial<Service>) => void
  onDelete?: (service: Service) => void
}

export function ServiceGrid({
  services,
  onEdit,
  onAdd,
  onUpdate,
  onDelete,
}: ServiceGridProps) {
  const [filter, setFilter] = useState<string>("all")

  const filteredServices = services.filter((service) => {
    if (filter === "all") return true
    return service.category === filter
  })

  const handleToggleAvailability = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId)
    if (service && onUpdate) {
      onUpdate(serviceId, { is_available: !service.is_available })
    }
  }

  const categories = [
    { value: "all", label: "Tous les services" },
    { value: "wellness", label: "Bien-être" },
    { value: "logistics", label: "Logistique" },
    { value: "gastronomy", label: "Gastronomie" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">Services & catalogue</h2>
          <p className="text-on-surface-variant">
            Offres complémentaires affichées aux clients (spa, transferts, restauration, etc.).
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="px-6 py-2 bg-on-surface text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-colors"
        >
          Ajouter un service
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {categories.map((category) => (
          <button
            type="button"
            key={category.value}
            onClick={() => setFilter(category.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === category.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleAvailability={handleToggleAvailability}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-6xl text-muted-foreground">
            {filter === "wellness" && "spa"}
            {filter === "logistics" && "local_shipping"}
            {filter === "gastronomy" && "restaurant"}
            {filter === "all" && "category"}
          </span>
          <p className="mt-4 text-muted-foreground">
            {filter === "all"
              ? "Aucun service pour le moment."
              : `Aucun service dans la catégorie « ${categories.find((c) => c.value === filter)?.label ?? filter} ».`}
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="mt-4 text-primary font-semibold hover:underline"
          >
            Créer un premier service
          </button>
        </div>
      )}
    </div>
  )
}
