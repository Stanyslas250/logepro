"use client"

import { useState, useMemo } from "react"
import type { Room, HotelFloor, RoomType } from "@/types/database"

interface BlueprintVisualizerProps {
  floor: HotelFloor | null
  rooms: Room[]
  onEditRoom?: (roomId: string) => void
}

const ROOM_TYPE_LABEL: Record<RoomType, string> = {
  standard: "Standard",
  suite: "Suite",
  apartment: "Appartement",
}

const STATUS_LABEL: Record<string, string> = {
  available: "Libre",
  occupied: "Occupée",
  cleaning: "Nettoyage",
  maintenance: "Maintenance",
}

export function BlueprintVisualizer({
  floor,
  rooms,
  onEditRoom,
}: BlueprintVisualizerProps) {
  const [zoomLevel, setZoomLevel] = useState(1)

  const floorRooms = useMemo(() => {
    if (!floor) return []
    return rooms
      .filter((r) => r.floor === floor.floor_number)
      .sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true }))
  }, [floor, rooms])

  if (!floor) {
    return (
      <div className="flex-1 bg-card rounded-xl p-8 shadow-sm flex items-center justify-center min-h-[280px]">
        <p className="text-muted-foreground text-center">
          Sélectionnez un étage dans la liste pour afficher les chambres associées (même numéro
          d’étage que dans la fiche chambre).
        </p>
      </div>
    )
  }

  const getRoomStyle = (room: Room) => {
    switch (room.status) {
      case "available":
        return "bg-emerald-500/5 border-2 border-dashed border-emerald-500/20"
      case "occupied":
        return "bg-primary/5 border-2 border-dashed border-primary/20"
      case "cleaning":
        return "bg-amber-500/5 border-2 border-dashed border-amber-500/20"
      case "maintenance":
        return "bg-destructive/5 border-2 border-dashed border-destructive/20"
      default:
        return "bg-accent"
    }
  }

  const getStatusColor = (room: Room) => {
    switch (room.status) {
      case "available":
        return "text-emerald-700"
      case "occupied":
        return "text-primary"
      case "cleaning":
        return "text-amber-700"
      case "maintenance":
        return "text-destructive"
      default:
        return "text-slate-400"
    }
  }

  return (
    <div className="flex-1 bg-card rounded-xl p-8 shadow-sm relative overflow-hidden min-h-[320px]">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          type="button"
          onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 2))}
          className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-primary"
          aria-label="Zoom avant"
        >
          <span className="material-symbols-outlined">zoom_in</span>
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.5))}
          className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-primary"
          aria-label="Zoom arrière"
        >
          <span className="material-symbols-outlined">zoom_out</span>
        </button>
      </div>

      <div className="mb-6 flex items-center gap-4 border-b border-accent pb-4 pr-24">
        <span className="material-symbols-outlined text-primary">floor</span>
        <div>
          <h3 className="font-bold text-xl">Plan — {floor.name}</h3>
          <p className="text-xs text-muted-foreground">
            Étage {floor.floor_number} — {floorRooms.length}{" "}
            {floorRooms.length <= 1 ? "chambre affichée" : "chambres affichées"}
          </p>
        </div>
      </div>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 transition-transform origin-top-left"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {floorRooms.length === 0 ? (
          <div className="col-span-full py-10 text-center text-muted-foreground text-sm">
            Aucune chambre pour le numéro d’étage « {floor.floor_number} ». Les chambres proviennent
            du module Chambres / fichier rooms (champ « floor »).
          </div>
        ) : (
          floorRooms.map((room) => (
            <button
              type="button"
              key={room.id}
              className={`rounded-lg flex flex-col items-center justify-center p-2 hover:opacity-90 transition-colors text-left ${getRoomStyle(
                room
              )}`}
              onClick={() => onEditRoom?.(room.id)}
            >
              <span className={`font-bold text-sm ${getStatusColor(room)}`}>{room.number}</span>
              <span className="text-[10px] uppercase font-bold tracking-tighter opacity-60">
                {ROOM_TYPE_LABEL[room.type] ?? room.type}
              </span>
              <span className="text-[9px] text-muted-foreground mt-0.5">
                {STATUS_LABEL[room.status] ?? room.status}
              </span>
            </button>
          ))
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30" />
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary/20 border border-primary/30" />
          <span>Occupée</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30" />
          <span>Nettoyage</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-destructive/20 border border-destructive/30" />
          <span>Maintenance</span>
        </div>
      </div>
    </div>
  )
}
