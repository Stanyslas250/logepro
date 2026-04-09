import { getTenantClient } from "@/lib/supabase/tenant"
import { requireAuth } from "@/lib/auth/require-auth"
import type { Room } from "@/types/database"

export default async function DashboardPage() {
  const user = await requireAuth()
  const supabase = await getTenantClient()

  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .returns<Room[]>()

  const totalRooms = rooms?.length ?? 0
  const available = rooms?.filter((r) => r.status === "available").length ?? 0
  const occupied = rooms?.filter((r) => r.status === "occupied").length ?? 0
  const cleaning = rooms?.filter((r) => r.status === "cleaning").length ?? 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          Tableau de bord
        </h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenue, {user.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total chambres" value={totalRooms} />
        <StatCard label="Disponibles" value={available} variant="success" />
        <StatCard label="Occupées" value={occupied} variant="primary" />
        <StatCard label="En nettoyage" value={cleaning} variant="warning" />
      </div>

      {/* Recent rooms */}
      {rooms && rooms.length > 0 && (
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-heading text-lg font-bold">
              Aperçu des chambres
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="px-6 py-3 font-medium">N°</th>
                  <th className="px-6 py-3 font-medium">Étage</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Capacité</th>
                  <th className="px-6 py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {rooms.slice(0, 10).map((room) => (
                  <tr
                    key={room.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-6 py-3 font-mono text-sm font-medium">
                      {room.number}
                    </td>
                    <td className="px-6 py-3 text-sm">{room.floor}</td>
                    <td className="px-6 py-3 text-sm capitalize">
                      {room.type}
                    </td>
                    <td className="px-6 py-3 text-sm">{room.capacity}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={room.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rooms.length > 10 && (
            <div className="border-t border-border px-6 py-3 text-center text-sm text-muted-foreground">
              et {rooms.length - 10} chambres de plus...
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  variant = "default",
}: {
  label: string
  value: number
  variant?: "default" | "success" | "primary" | "warning"
}) {
  const colors = {
    default: "text-foreground",
    success: "text-emerald-600",
    primary: "text-primary",
    warning: "text-amber-600",
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className={`font-heading mt-1 text-3xl font-bold ${colors[variant]}`}>
        {value}
      </p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    available: "bg-emerald-500/10 text-emerald-600",
    occupied: "bg-primary/10 text-primary",
    cleaning: "bg-amber-500/10 text-amber-600",
    maintenance: "bg-destructive/10 text-destructive",
  }

  const labels: Record<string, string> = {
    available: "Disponible",
    occupied: "Occupée",
    cleaning: "Nettoyage",
    maintenance: "Maintenance",
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {labels[status] ?? status}
    </span>
  )
}
