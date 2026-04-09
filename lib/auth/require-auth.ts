import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { getCurrentUser, type AuthUser } from "./get-user"

/**
 * Server-side guard: ensures the user is authenticated and has a membership
 * for the current tenant. Redirects to /login if not.
 */
export async function requireAuth(): Promise<AuthUser> {
  const headersList = await headers()
  const tenantId = headersList.get("x-tenant-id")

  const user = await getCurrentUser(tenantId)

  if (!user) {
    redirect("/login")
  }

  if (tenantId && !user.membership) {
    redirect("/access-denied")
  }

  return user
}
