"use client"

import type { HotelFloor } from "@/types/database"

interface FloorNavigatorProps {
  floors: HotelFloor[]
  activeFloorId: string | null
  roomCountByFloor?: Map<number, number>
  onFloorSelect: (floorId: string) => void
  onAddFloor: () => void
  onEditFloor?: (floor: HotelFloor) => void
  onDeleteFloor?: (floor: HotelFloor) => void
}

export function FloorNavigator({
  floors,
  activeFloorId,
  roomCountByFloor,
  onFloorSelect,
  onAddFloor,
  onEditFloor,
  onDeleteFloor,
}: FloorNavigatorProps) {
  return (
    <div className="space-y-3">
      {floors.length === 0 && (
        <p className="text-sm text-muted-foreground px-1">
          Aucun étage défini. Ajoutez un premier niveau pour organiser le plan.
        </p>
      )}
      {floors.map((floor) => (
        <div
          key={floor.id}
          className={`rounded-xl transition-all ${
            activeFloorId === floor.id
              ? "bg-white shadow-sm border-l-4 border-primary"
              : "bg-muted hover:bg-accent"
          }`}
        >
          <button
            type="button"
            onClick={() => onFloorSelect(floor.id)}
            className="w-full p-4 text-left"
          >
            <div className="flex justify-between items-center gap-2">
              <span className={`font-bold ${activeFloorId === floor.id ? "text-lg" : ""}`}>
                {floor.name}
              </span>
              {(() => {
                const count = roomCountByFloor?.get(floor.floor_number) ?? floor.room_count
                return (
                  <span
                    className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                      activeFloorId === floor.id ? "bg-accent" : "text-slate-400"
                    }`}
                  >
                    {count} {count <= 1 ? "chambre" : "chambres"}
                  </span>
                )
              })()}
            </div>
            <span className="text-[10px] text-muted-foreground">Étage n° {floor.floor_number}</span>
          </button>
          {(onEditFloor || onDeleteFloor) && (
            <div className="flex justify-end gap-1 px-2 pb-2">
              {onEditFloor && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditFloor(floor)
                  }}
                  className="text-xs px-2 py-1 rounded-md hover:bg-accent text-primary font-medium"
                >
                  Modifier
                </button>
              )}
              {onDeleteFloor && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteFloor(floor)
                  }}
                  className="text-xs px-2 py-1 rounded-md hover:bg-destructive/10 text-destructive font-medium"
                >
                  Supprimer
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={onAddFloor}
        className="w-full p-4 rounded-xl border-2 border-dashed border-border hover:border-primary transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-primary"
      >
        <span className="material-symbols-outlined">add_circle</span>
        <span className="font-medium">Ajouter un étage</span>
      </button>
    </div>
  )
}
