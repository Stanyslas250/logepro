import { getTenantClient } from "@/lib/supabase/tenant"
import { requireAuth } from "@/lib/auth/require-auth"
import { SettingsClient } from "./client"

export default async function SettingsPage() {
  await requireAuth()
  const supabase = await getTenantClient()

  // Fetch data
  const [{ data: floors }, { data: categories }, { data: services }, { data: rooms }] =
    await Promise.all([
      supabase.from("hotel_floors").select("*").order("floor_number"),
      supabase.from("room_categories").select("*"),
      supabase.from("services").select("*"),
      supabase.from("rooms").select("*"),
    ])

  return (
    <SettingsClient
      floors={floors ?? []}
      categories={categories ?? []}
      services={services ?? []}
      rooms={rooms ?? []}
    />
  )
}
