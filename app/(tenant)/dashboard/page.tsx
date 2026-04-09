import { getTenantClient } from "@/lib/supabase/tenant"
import { requireAuth } from "@/lib/auth/require-auth"
import type { Room, Reservation, Guest } from "@/types/database"
import { ReservationSummary } from "@/components/dashboard/ReservationSummary"
import { OccupancyChart } from "@/components/dashboard/OccupancyChart"
import { RevenueCard } from "@/components/dashboard/RevenueCard"
import { BookingTrendsChart } from "@/components/dashboard/BookingTrendsChart"
import { CalendarWidget } from "@/components/dashboard/CalendarWidget"
import { NewCustomersList } from "@/components/dashboard/NewCustomersList"
import { RecentActivities } from "@/components/dashboard/RecentActivities"

export default async function DashboardPage() {
  const user = await requireAuth()
  const supabase = await getTenantClient()

  const today = new Date().toISOString().split("T")[0]
  const now = new Date()

  // --- Rooms ---
  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .returns<Room[]>()

  const totalRooms = rooms?.length ?? 0
  const available = rooms?.filter((r) => r.status === "available").length ?? 0
  const occupied = rooms?.filter((r) => r.status === "occupied").length ?? 0
  const cleaning = rooms?.filter((r) => r.status === "cleaning").length ?? 0
  const notReady = rooms?.filter((r) => r.status === "maintenance").length ?? 0

  // --- Arrivals & Departures today ---
  const { count: arrivalsToday } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("check_in", today)
    .in("status", ["confirmed", "checked_in"])

  const { count: departuresToday } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("check_out", today)
    .in("status", ["checked_in", "checked_out"])

  // --- Revenue (last 30 days & yesterday) ---
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: recentPayments } = await supabase
    .from("payments")
    .select("amount")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .eq("status", "completed")

  const revenueLast30Days =
    recentPayments?.reduce((sum, p) => sum + (p.amount ?? 0), 0) ?? 0

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split("T")[0]

  const { data: yesterdayPayments } = await supabase
    .from("payments")
    .select("amount")
    .gte("created_at", `${yesterdayStr}T00:00:00`)
    .lt("created_at", `${today}T00:00:00`)
    .eq("status", "completed")

  const revenueYesterday =
    yesterdayPayments?.reduce((sum, p) => sum + (p.amount ?? 0), 0) ?? 0

  // --- Booking trends (last 7 days) ---
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)

  const { data: weekReservations } = await supabase
    .from("reservations")
    .select("created_at")
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: true })

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
  const trendMap = new Map<string, number>()
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo)
    d.setDate(d.getDate() + i)
    const key = d.toISOString().split("T")[0]
    trendMap.set(key, 0)
  }
  for (const r of weekReservations ?? []) {
    const key = new Date(r.created_at).toISOString().split("T")[0]
    if (trendMap.has(key)) {
      trendMap.set(key, (trendMap.get(key) ?? 0) + 1)
    }
  }
  const bookingTrends = [...trendMap.entries()].map(([dateStr, count]) => ({
    day: dayNames[new Date(dateStr).getDay()],
    bookings: count,
  }))

  // --- Calendar: upcoming arrivals/departures (next 5 days) ---
  const calendarEvents = []
  for (let i = 0; i < 5; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().split("T")[0]
    const dayName = dayNames[d.getDay()]

    const { data: arrivals } = await supabase
      .from("reservations")
      .select("*, guests(*)")
      .eq("check_in", dateStr)
      .in("status", ["confirmed", "checked_in"])
      .limit(1)

    if (arrivals && arrivals.length > 0) {
      const a = arrivals[0] as Reservation & { guests: Guest }
      const { data: room } = await supabase
        .from("rooms")
        .select("type, number")
        .eq("id", a.room_id)
        .single()

      calendarEvents.push({
        id: a.id,
        guestName: a.guests?.full_name ?? "—",
        roomType: room?.type ?? "",
        roomNumber: `Chambre ${room?.number ?? ""}`,
        date: d.getDate(),
        day: dayName,
        status: "arrival" as const,
      })
    } else {
      calendarEvents.push({
        id: `none-${i}`,
        guestName: "",
        roomType: "",
        roomNumber: "",
        date: d.getDate(),
        day: dayName,
        status: "none" as const,
      })
    }
  }

  // --- New Customers (recent guests with their latest reservation) ---
  const { data: recentGuests } = await supabase
    .from("guests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  const customerList = []
  for (const guest of recentGuests ?? []) {
    const { data: lastRes } = await supabase
      .from("reservations")
      .select("*, rooms(*)")
      .eq("guest_id", guest.id)
      .order("created_at", { ascending: false })
      .limit(1)

    const res = lastRes?.[0] as (Reservation & { rooms: Room }) | undefined
    const fmtDate = (d: string) =>
      new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })

    // Check if a payment exists for this reservation
    let paymentStatus: "paid" | "pending" = "pending"
    if (res) {
      const { data: payments } = await supabase
        .from("payments")
        .select("status")
        .eq("reservation_id", res.id)
        .eq("status", "completed")
        .limit(1)
      if (payments && payments.length > 0) paymentStatus = "paid"
    }

    customerList.push({
      id: guest.id,
      name: guest.full_name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(guest.full_name)}`,
      roomNumber: res ? `Chambre ${res.rooms?.number ?? "—"}` : "—",
      roomType: res?.rooms?.type ?? "—",
      checkIn: res ? fmtDate(res.check_in) : "—",
      checkOut: res ? fmtDate(res.check_out) : "—",
      paymentStatus,
    })
  }

  // --- Recent Activities (latest reservations as activity feed) ---
  const { data: recentRes } = await supabase
    .from("reservations")
    .select("*, guests(*)")
    .order("created_at", { ascending: false })
    .limit(5)

  const activityList = (recentRes ?? []).map((r) => {
    const guest = (r as Reservation & { guests: Guest }).guests
    const time = new Date(r.created_at).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })

    let type: "complaint" | "request" | "service" = "service"
    let title = "Nouvelle réservation"
    if (r.status === "cancelled") {
      type = "complaint"
      title = "Annulation"
    } else if (r.status === "checked_in") {
      type = "request"
      title = "Check-in effectué"
    }

    return {
      id: r.id,
      type,
      title,
      description: `${guest?.full_name ?? "Client"} — ${r.status === "cancelled" ? "Réservation annulée" : `Réservation ${r.status}`}`,
      time,
    }
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          Tableau de bord
        </h1>
        <p className="mt-1 text-muted-foreground">
          Bonjour, {user.email?.split("@")[0]} !
        </p>
      </div>

      {/* Bento Grid - Top Row */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Reservation Summary */}
        <div className="col-span-12 lg:col-span-4">
          <ReservationSummary
            inHome={occupied}
            arrivals={arrivalsToday ?? 0}
            departures={departuresToday ?? 0}
            cleaningTasks={cleaning}
          />
        </div>

        {/* Occupancy Chart */}
        <div className="col-span-12 lg:col-span-4">
          <OccupancyChart
            vacant={available}
            occupied={occupied}
            notReady={notReady}
          />
        </div>

        {/* Revenue Card */}
        <div className="col-span-12 lg:col-span-4">
          <RevenueCard
            last30Days={revenueLast30Days}
            yesterday={revenueYesterday}
          />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Booking Trends Graph */}
        <div className="col-span-12 lg:col-span-8">
          <BookingTrendsChart data={bookingTrends} />
        </div>

        {/* Calendar Widget */}
        <div className="col-span-12 lg:col-span-4">
          <CalendarWidget events={calendarEvents} />
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-12 gap-6">
        {/* New Customers List */}
        <div className="col-span-12 lg:col-span-6">
          <NewCustomersList customers={customerList} />
        </div>

        {/* Recent Activities */}
        <div className="col-span-12 lg:col-span-6">
          <RecentActivities activities={activityList} />
        </div>
      </div>
    </div>
  )
}

