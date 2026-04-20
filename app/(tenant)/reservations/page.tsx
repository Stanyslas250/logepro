import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { getTenantClient } from "@/lib/supabase/tenant"
import { requireAuth } from "@/lib/auth/require-auth"
import type { Reservation, Room, Guest } from "@/types/database"
import { ReservationStats } from "@/components/reservations/reservation-stats"
import { ReservationTable } from "@/components/reservations/reservation-table"
import { ReservationFilters } from "@/components/reservations/reservation-filters"

type ReservationWithJoins = Reservation & {
  rooms: Room
  guests: Guest
}

interface PageProps {
  searchParams: Promise<{
    status?: string
    room_type?: string
    page?: string
  }>
}

export default async function ReservationsPage({ searchParams }: PageProps) {
  await requireAuth()
  const supabase = await getTenantClient()

  const params = await searchParams
  const status = params.status
  const roomType = params.room_type
  const page = parseInt(params.page ?? "1", 10)
  const perPage = 20
  const offset = (page - 1) * perPage

  // Build query
  let query = supabase
    .from("reservations")
    .select("*, rooms(*), guests(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1)

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data, count } = await query

  // Filter by room type client-side since it's a joined column
  let reservations = (data ?? []) as ReservationWithJoins[]
  if (roomType && roomType !== "all") {
    reservations = reservations.filter((r) => r.rooms?.type === roomType)
  }

  // Stats
  const today = new Date().toISOString().split("T")[0]

  const { count: arrivalsToday } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("check_in", today)
    .in("status", ["confirmed", "checked_in"])

  const { data: rooms } = await supabase.from("rooms").select("status")
  const totalRooms = rooms?.length ?? 0
  const occupiedRooms = rooms?.filter((r) => r.status === "occupied").length ?? 0
  const occupancyRate =
    totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

  const { data: todayRes } = await supabase
    .from("reservations")
    .select("total_amount")
    .eq("check_in", today)
    .in("status", ["confirmed", "checked_in"])

  const projectedRevenue =
    todayRes?.reduce((sum, r) => sum + (r.total_amount ?? 0), 0) ?? 0

  return (
    <section className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
            Réservations
          </h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Gérez le flux de vos clients et l&apos;occupation des chambres.
          </p>
        </div>
        <Link
          href="/reservations/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-[14px]" strokeWidth={2} />
          Nouvelle réservation
        </Link>
      </div>

      {/* Stats */}
      <ReservationStats
        arrivalsToday={arrivalsToday ?? 0}
        occupancyRate={occupancyRate}
        projectedRevenue={projectedRevenue}
      />

      {/* Filters */}
      <Suspense fallback={null}>
        <ReservationFilters />
      </Suspense>

      {/* Table */}
      <ReservationTable
        reservations={reservations}
        total={count ?? 0}
        page={page}
        perPage={perPage}
      />
    </section>
  )
}
