import { createAdminClient } from "@/lib/supabase/admin"
import type { Organization } from "@/types/database"

/**
 * Get all organizations in a group (multi-site).
 * Returns the parent org and all child sites.
 */
export async function getGroupOrganizations(
  groupId: string
): Promise<Organization[]> {
  const admin = createAdminClient()

  const { data } = await admin
    .schema("platform")
    .from("organizations")
    .select("*")
    .or(`id.eq.${groupId},group_id.eq.${groupId}`)
    .eq("status", "active")
    .order("created_at", { ascending: true })

  return (data as Organization[]) ?? []
}

/**
 * Get all organizations a user has membership in.
 */
export async function getUserOrganizations(
  userId: string
): Promise<Organization[]> {
  const admin = createAdminClient()

  const { data: memberships } = await admin
    .schema("platform")
    .from("memberships")
    .select("organization_id")
    .eq("user_id", userId)

  if (!memberships || memberships.length === 0) return []

  const orgIds = memberships.map((m) => m.organization_id)

  const { data: orgs } = await admin
    .schema("platform")
    .from("organizations")
    .select("*")
    .in("id", orgIds)
    .eq("status", "active")

  return (orgs as Organization[]) ?? []
}
