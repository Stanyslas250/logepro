import { getTenantClient } from "@/lib/supabase/tenant"
import { requireAuth } from "@/lib/auth/require-auth"
import type { Room } from "@/types/database"
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

  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .returns<Room[]>()

  const totalRooms = rooms?.length ?? 0
  const available = rooms?.filter((r) => r.status === "available").length ?? 0
  const occupied = rooms?.filter((r) => r.status === "occupied").length ?? 0
  const cleaning = rooms?.filter((r) => r.status === "cleaning").length ?? 0
  const notReady = rooms?.filter((r) => r.status === "maintenance").length ?? 0

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">
            Tableau de bord
          </h1>
          <p className="mt-1 text-muted-foreground">
            Bonjour ! {user.email?.split("@")[0]}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-card p-2 px-4 rounded-xl shadow-sm border border-border">
          <span className="text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </span>
          <span className="font-semibold text-sm">Hilton Garden Inn</span>
          <span className="text-muted-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>

      {/* Bento Grid - Top Row */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Reservation Summary */}
        <div className="col-span-12 lg:col-span-4">
          <ReservationSummary
            inHome={occupied}
            arrivals={4}
            departures={7}
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
            last30Days={1500}
            yesterday={350}
          />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Booking Trends Graph */}
        <div className="col-span-12 lg:col-span-8">
          <BookingTrendsChart />
        </div>

        {/* Calendar Widget */}
        <div className="col-span-12 lg:col-span-4">
          <CalendarWidget />
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-12 gap-6">
        {/* New Customers List */}
        <div className="col-span-12 lg:col-span-6">
          <NewCustomersList />
        </div>

        {/* Recent Activities */}
        <div className="col-span-12 lg:col-span-6">
          <RecentActivities />
        </div>
      </div>
    </div>
  )
}

