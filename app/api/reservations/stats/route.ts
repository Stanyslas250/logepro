import { NextResponse } from "next/server"
import { getTenantClient } from "@/lib/supabase/tenant"
import { getCurrentUser } from "@/lib/auth/get-user"
import { headers } from "next/headers"

/**
 * GET /api/reservations/stats
 * Returns dashboard stats: arrivals today, occupancy rate, projected revenue.
 */
export async function GET() {
  const headersList = await headers()
  const tenantId = headersList.get("x-tenant-id")
  const user = await getCurrentUser(tenantId)
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const supabase = await getTenantClient()
  const today = new Date().toISOString().split("T")[0]

  // Arrivals today
  const { count: arrivalsToday } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("check_in", today)
    .in("status", ["confirmed", "checked_in"])

  // Departures today
  const { count: departuresToday } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("check_out", today)
    .in("status", ["checked_in", "checked_out"])

  // Total rooms & occupied rooms
  const { data: rooms } = await supabase.from("rooms").select("status")
  const totalRooms = rooms?.length ?? 0
  const occupiedRooms = rooms?.filter((r) => r.status === "occupied").length ?? 0
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

  // Projected revenue today (reservations with check_in today)
  const { data: todayReservations } = await supabase
    .from("reservations")
    .select("total_amount")
    .eq("check_in", today)
    .in("status", ["confirmed", "checked_in"])

  const projectedRevenue = todayReservations?.reduce((sum, r) => sum + (r.total_amount ?? 0), 0) ?? 0

  // Revenue last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const { data: recentPayments } = await supabase
    .from("payments")
    .select("amount")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .eq("status", "completed")

  const revenueLast30Days = recentPayments?.reduce((sum, p) => sum + (p.amount ?? 0), 0) ?? 0

  // Revenue yesterday
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split("T")[0]
  const { data: yesterdayPayments } = await supabase
    .from("payments")
    .select("amount")
    .gte("created_at", `${yesterdayStr}T00:00:00`)
    .lt("created_at", `${today}T00:00:00`)
    .eq("status", "completed")

  const revenueYesterday = yesterdayPayments?.reduce((sum, p) => sum + (p.amount ?? 0), 0) ?? 0

  // Checked-in count
  const { count: checkedInCount } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("status", "checked_in")

  return NextResponse.json({
    arrivals_today: arrivalsToday ?? 0,
    departures_today: departuresToday ?? 0,
    checked_in: checkedInCount ?? 0,
    occupancy_rate: occupancyRate,
    total_rooms: totalRooms,
    occupied_rooms: occupiedRooms,
    projected_revenue: projectedRevenue,
    revenue_last_30_days: revenueLast30Days,
    revenue_yesterday: revenueYesterday,
  })
}
