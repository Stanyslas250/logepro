import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export interface PlatformAdminUser {
  id: string
  email: string
}

/**
 * Server-side guard: ensures the user is authenticated AND is a platform admin.
 * Redirects to /login if not authenticated, to / if not a platform admin.
 */
export async function requirePlatformAdmin(): Promise<PlatformAdminUser> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const admin = createAdminClient()

  const { data } = await admin
    .schema("platform")
    .from("platform_admins")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!data) {
    redirect("/")
  }

  return {
    id: user.id,
    email: user.email ?? "",
  }
}
