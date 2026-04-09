import { createClient } from "@/lib/supabase/server"
import type { Membership, MemberRole } from "@/types/database"

export interface AuthUser {
  id: string
  email: string
  membership: Membership | null
  role: MemberRole | null
}

/**
 * Get the current authenticated user with their membership for the current tenant.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(
  tenantOrgId?: string | null
): Promise<AuthUser | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  let membership: Membership | null = null

  if (tenantOrgId) {
    const { data } = await supabase
      .schema("platform")
      .from("memberships")
      .select("*")
      .eq("user_id", user.id)
      .eq("organization_id", tenantOrgId)
      .single()

    membership = data as Membership | null
  }

  return {
    id: user.id,
    email: user.email ?? "",
    membership,
    role: membership?.role as MemberRole | null,
  }
}
