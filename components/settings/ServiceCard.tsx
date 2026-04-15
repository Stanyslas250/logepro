import type { Service } from "@/types/database"

interface ServiceCardProps {
  service: Service
  onEdit?: (service: Service) => void
  onDelete?: (service: Service) => void
  onToggleAvailability?: (serviceId: string) => void
}

export function ServiceCard({
  service,
  onEdit,
  onDelete,
  onToggleAvailability,
}: ServiceCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "wellness":
        return "bg-tertiary-fixed text-tertiary"
      case "logistics":
        return "bg-secondary-fixed text-secondary"
      case "gastronomy":
        return "bg-primary-fixed text-primary"
      default:
        return "bg-accent text-foreground"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "wellness":
        return "Bien-être"
      case "logistics":
        return "Logistique"
      case "gastronomy":
        return "Gastronomie"
      default:
        return category
    }
  }

  const getStatusColor = () => {
    if (service.is_available) {
      return "bg-tertiary"
    }
    return "bg-orange-500"
  }

  const getStatusLabel = () => {
    if (service.is_available) {
      return "Disponible"
    }
    return "Indisponible"
  }

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
      {/* Image */}
      {service.image_url ? (
        <div className="h-40 overflow-hidden relative">
          <img
            src={service.image_url}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded">
              {getCategoryLabel(service.category)}
            </span>
          </div>
        </div>
      ) : (
        <div className="h-40 bg-muted flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-muted-foreground">
            {service.category === "wellness" && "spa"}
            {service.category === "logistics" && "local_shipping"}
            {service.category === "gastronomy" && "restaurant"}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-xl">{service.name}</h4>
          <span className="text-primary font-bold">{service.price_label}</span>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          {service.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
            <span className="text-xs font-semibold text-tertiary">
              {getStatusLabel()}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              type="button"
              onClick={() => onToggleAvailability?.(service.id)}
              className="text-primary text-xs font-bold hover:underline"
            >
              {service.is_available ? "Désactiver" : "Activer"}
            </button>
            <button
              type="button"
              onClick={() => onEdit?.(service)}
              className="text-primary text-xs font-bold hover:underline"
            >
              Modifier
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(service)}
                className="text-destructive text-xs font-bold hover:underline"
              >
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
