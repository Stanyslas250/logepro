import { getTenantClient } from "@/lib/supabase/tenant"
import { requireAuth } from "@/lib/auth/require-auth"
import type { Room } from "@/types/database"

export default async function RoomsPage() {
  await requireAuth()
  const supabase = await getTenantClient()

  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .order("floor", { ascending: true })
    .order("number", { ascending: true })
    .returns<Room[]>()

  // Group rooms by floor
  const floors = new Map<number, Room[]>()
  for (const room of rooms ?? []) {
    const existing = floors.get(room.floor) ?? []
    existing.push(room)
    floors.set(room.floor, existing)
  }

  const statusStyles: Record<string, string> = {
    available: "border-emerald-500/30 bg-emerald-500/5 text-emerald-700",
    occupied: "border-primary/30 bg-primary/5 text-primary",
    cleaning: "border-amber-500/30 bg-amber-500/5 text-amber-700",
    maintenance: "border-destructive/30 bg-destructive/5 text-destructive",
  }

  const statusLabels: Record<string, string> = {
    available: "Disponible",
    occupied: "Occupée",
    cleaning: "Nettoyage",
    maintenance: "Maintenance",
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          Chambres
        </h1>
        <p className="mt-1 text-muted-foreground">
          {rooms?.length ?? 0} chambres au total
        </p>
      </div>

      <div className="space-y-8">
        {[...floors.entries()]
          .sort(([a], [b]) => a - b)
          .map(([floor, floorRooms]) => (
            <div key={floor}>
              <h2 className="font-heading mb-4 text-lg font-bold">
                Étage {floor}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {floorRooms.map((room) => (
                  <div
                    key={room.id}
                    className={`flex flex-col items-center rounded-xl border p-4 transition-colors ${statusStyles[room.status] ?? "border-border bg-card"}`}
                  >
                    <span className="font-mono text-lg font-bold">
                      {room.number}
                    </span>
                    <span className="mt-1 text-xs capitalize">
                      {room.type}
                    </span>
                    <span className="mt-1 text-xs opacity-75">
                      {statusLabels[room.status] ?? room.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {(!rooms || rooms.length === 0) && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/50 px-16 py-20 text-center">
          <p className="font-heading text-xl font-bold">
            Aucune chambre configurée
          </p>
          <p className="mt-2 text-muted-foreground">
            Les chambres seront créées lors du provisionnement de
            l&apos;établissement.
          </p>
        </div>
      )}
    </div>
  )
}
