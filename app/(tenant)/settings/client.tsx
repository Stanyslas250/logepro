"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { FloorNavigator } from "@/components/settings/FloorNavigator"
import { BlueprintVisualizer } from "@/components/settings/BlueprintVisualizer"
import { RoomCategoryTable } from "@/components/settings/RoomCategoryTable"
import { ServiceGrid } from "@/components/settings/ServiceGrid"
import { FloorModal, RoomCategoryModal, ServiceModal } from "@/components/settings/settings-modals"
import type { HotelFloor, RoomCategory, Service, ServiceCategory, Room } from "@/types/database"

interface SettingsClientProps {
  floors: HotelFloor[]
  categories: RoomCategory[]
  services: Service[]
  rooms: Room[]
}

async function apiMessage(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as { error?: string; details?: string }
    return j.details || j.error || `Erreur ${res.status}`
  } catch {
    return `Erreur ${res.status}`
  }
}

export function SettingsClient({
  floors: floorsProp,
  categories: categoriesProp,
  services: servicesProp,
  rooms: roomsProp,
}: SettingsClientProps) {
  const router = useRouter()
  const [floors, setFloors] = useState(floorsProp)
  const [categories, setCategories] = useState(categoriesProp)
  const [services, setServices] = useState(servicesProp)
  const [rooms, setRooms] = useState(roomsProp)
  const [activeFloorId, setActiveFloorId] = useState<string | null>(
    floorsProp.length > 0 ? floorsProp[0].id : null
  )
  const [banner, setBanner] = useState<{ type: "error" | "ok"; text: string } | null>(null)

  const [floorModalOpen, setFloorModalOpen] = useState(false)
  const [editingFloor, setEditingFloor] = useState<HotelFloor | null>(null)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<RoomCategory | null>(null)
  const [serviceModalOpen, setServiceModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  useEffect(() => {
    setFloors(floorsProp)
  }, [floorsProp])

  useEffect(() => {
    setCategories(categoriesProp)
  }, [categoriesProp])

  useEffect(() => {
    setServices(servicesProp)
  }, [servicesProp])

  useEffect(() => {
    setRooms(roomsProp)
  }, [roomsProp])

  useEffect(() => {
    if (activeFloorId && !floors.some((f) => f.id === activeFloorId)) {
      setActiveFloorId(floors[0]?.id ?? null)
    }
  }, [floors, activeFloorId])

  const refresh = useCallback(() => {
    router.refresh()
  }, [router])

  const showError = (msg: string) => {
    setBanner({ type: "error", text: msg })
    setTimeout(() => setBanner(null), 6000)
  }

  const showOk = (msg: string) => {
    setBanner({ type: "ok", text: msg })
    setTimeout(() => setBanner(null), 4000)
  }

  const handleFloorSelect = (floorId: string) => {
    setActiveFloorId(floorId)
  }

  const handleAddFloor = () => {
    setEditingFloor(null)
    setFloorModalOpen(true)
  }

  const handleEditFloor = (floor: HotelFloor) => {
    setEditingFloor(floor)
    setFloorModalOpen(true)
  }

  const roomCountByFloorNumber = useMemo(() => {
    const map = new Map<number, number>()
    for (const room of rooms) {
      map.set(room.floor, (map.get(room.floor) ?? 0) + 1)
    }
    return map
  }, [rooms])

  const saveFloor = async (payload: { name: string; floor_number: number }) => {
    const room_count = roomCountByFloorNumber.get(payload.floor_number) ?? 0
    const body = { ...payload, room_count }
    if (editingFloor) {
      const res = await fetch(`/api/settings/floors/${editingFloor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const msg = await apiMessage(res)
        showError(msg)
        throw new Error(msg)
      }
      const { floor } = (await res.json()) as { floor: HotelFloor }
      setFloors((prev) => prev.map((f) => (f.id === floor.id ? floor : f)))
      showOk("Étage mis à jour.")
    } else {
      const res = await fetch("/api/settings/floors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const msg = await apiMessage(res)
        showError(msg)
        throw new Error(msg)
      }
      const { floor } = (await res.json()) as { floor: HotelFloor }
      setFloors((prev) => [...prev, floor].sort((a, b) => a.floor_number - b.floor_number))
      setActiveFloorId(floor.id)
      showOk("Étage créé.")
    }
    refresh()
  }

  const handleDeleteFloor = async (floor: HotelFloor) => {
    if (
      !window.confirm(
        `Supprimer l’étage « ${floor.name} » ? Les chambres liées dans la base ne seront pas supprimées automatiquement.`
      )
    ) {
      return
    }
    const res = await fetch(`/api/settings/floors/${floor.id}`, { method: "DELETE" })
    if (!res.ok) {
      const msg = await apiMessage(res)
      showError(msg)
      return
    }
    const nextFloors = floors.filter((f) => f.id !== floor.id)
    setFloors(nextFloors)
    if (activeFloorId === floor.id) {
      setActiveFloorId(nextFloors[0]?.id ?? null)
    }
    showOk("Étage supprimé.")
    refresh()
  }

  const handleAddCategory = () => {
    setEditingCategory(null)
    setCategoryModalOpen(true)
  }

  const handleEditCategory = (category: RoomCategory) => {
    setEditingCategory(category)
    setCategoryModalOpen(true)
  }

  const saveCategory = async (payload: {
    name: string
    subtitle: string | null
    status_label: string
    base_rate: number
    capacity: number
    room_numbers: string[]
  }) => {
    if (editingCategory) {
      const res = await fetch(`/api/settings/room-categories/${editingCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const msg = await apiMessage(res)
        showError(msg)
        throw new Error(msg)
      }
      const { category } = (await res.json()) as { category: RoomCategory }
      setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)))
      showOk("Catégorie mise à jour.")
    } else {
      const res = await fetch("/api/settings/room-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const msg = await apiMessage(res)
        showError(msg)
        throw new Error(msg)
      }
      const { category } = (await res.json()) as { category: RoomCategory }
      setCategories((prev) => [...prev, category])
      showOk("Catégorie créée.")
    }
    refresh()
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return
    const res = await fetch(`/api/settings/room-categories/${categoryId}`, { method: "DELETE" })
    if (!res.ok) {
      showError(await apiMessage(res))
      return
    }
    setCategories((prev) => prev.filter((c) => c.id !== categoryId))
    showOk("Catégorie supprimée.")
    refresh()
  }

  const handleAddService = () => {
    setEditingService(null)
    setServiceModalOpen(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setServiceModalOpen(true)
  }

  const saveService = async (payload: {
    name: string
    category: ServiceCategory
    description: string
    price_label: string
    image_url: string | null
    is_available: boolean
  }) => {
    if (editingService) {
      const res = await fetch(`/api/settings/services/${editingService.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const msg = await apiMessage(res)
        showError(msg)
        throw new Error(msg)
      }
      const { service } = (await res.json()) as { service: Service }
      setServices((prev) => prev.map((s) => (s.id === service.id ? service : s)))
      showOk("Service mis à jour.")
    } else {
      const res = await fetch("/api/settings/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const msg = await apiMessage(res)
        showError(msg)
        throw new Error(msg)
      }
      const { service } = (await res.json()) as { service: Service }
      setServices((prev) => [...prev, service])
      showOk("Service créé.")
    }
    refresh()
  }

  const handleUpdateService = async (serviceId: string, updates: Partial<Service>) => {
    const res = await fetch(`/api/settings/services/${serviceId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!res.ok) {
      showError(await apiMessage(res))
      return
    }
    const { service } = (await res.json()) as { service: Service }
    setServices((prev) => prev.map((s) => (s.id === service.id ? service : s)))
    refresh()
  }

  const handleDeleteService = async (service: Service) => {
    if (!window.confirm(`Supprimer le service « ${service.name} » ?`)) return
    const res = await fetch(`/api/settings/services/${service.id}`, { method: "DELETE" })
    if (!res.ok) {
      showError(await apiMessage(res))
      return
    }
    setServices((prev) => prev.filter((s) => s.id !== service.id))
    showOk("Service supprimé.")
    refresh()
  }

  const activeFloor = floors.find((f) => f.id === activeFloorId) ?? null

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-12">
      {banner && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            banner.type === "error"
              ? "bg-destructive/10 text-destructive border border-destructive/20"
              : "bg-emerald-500/10 text-emerald-800 border border-emerald-500/20"
          }`}
        >
          {banner.text}
        </div>
      )}

      <FloorModal
        open={floorModalOpen}
        floor={editingFloor}
        onClose={() => {
          setFloorModalOpen(false)
          setEditingFloor(null)
        }}
        onSave={saveFloor}
      />
      <RoomCategoryModal
        open={categoryModalOpen}
        category={editingCategory}
        onClose={() => {
          setCategoryModalOpen(false)
          setEditingCategory(null)
        }}
        onSave={saveCategory}
      />
      <ServiceModal
        open={serviceModalOpen}
        service={editingService}
        onClose={() => {
          setServiceModalOpen(false)
          setEditingService(null)
        }}
        onSave={saveService}
      />

      <section className="space-y-5">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
            Paramètres de l&apos;établissement
          </h1>
          <p className="mt-0.5 max-w-2xl text-[13px] text-muted-foreground">
            Gérez les étages, les catégories de chambres et les services proposés aux clients. Le plan affiche les chambres dont le numéro d&apos;étage correspond au niveau défini.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3">
            <FloorNavigator
              floors={floors}
              activeFloorId={activeFloorId}
              roomCountByFloor={roomCountByFloorNumber}
              onFloorSelect={handleFloorSelect}
              onAddFloor={handleAddFloor}
              onEditFloor={handleEditFloor}
              onDeleteFloor={handleDeleteFloor}
            />
          </div>
          <div className="lg:col-span-9">
            <BlueprintVisualizer floor={activeFloor} rooms={rooms} />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <RoomCategoryTable
          categories={categories}
          onAdd={handleAddCategory}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      </section>

      <section>
        <ServiceGrid
          services={services}
          onAdd={handleAddService}
          onEdit={handleEditService}
          onUpdate={handleUpdateService}
          onDelete={handleDeleteService}
        />
      </section>
    </div>
  )
}
