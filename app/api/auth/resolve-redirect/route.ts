import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * GET /api/auth/resolve-redirect
 * Looks up the authenticated user's memberships and returns the correct
 * tenant URL to redirect to after login.
 *
 * Returns:
 *   - { redirect: "http://{slug}.{domain}/dashboard" }  if 1 org
 *   - { redirect: "/select-org", orgs: [...] }          if multiple orgs
 *   - { redirect: "/onboarding/forfait" }                if no org
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ redirect: "/login" })
    }

    const admin = createAdminClient()

    const { data: memberships } = await admin
      .schema("platform")
      .from("memberships")
      .select("organization_id, role")
      .eq("user_id", user.id)

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ redirect: "/onboarding/forfait" })
    }

    const orgIds = memberships.map((m) => m.organization_id)

    const { data: orgs } = await admin
      .schema("platform")
      .from("organizations")
      .select("id, name, slug, status")
      .in("id", orgIds)
      .eq("status", "active")

    if (!orgs || orgs.length === 0) {
      return NextResponse.json({ redirect: "/onboarding/forfait" })
    }

    const protocol = process.env.NEXT_PUBLIC_PROTOCOL ?? "https"
    const domain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "logepro.app"

    if (orgs.length === 1) {
      const tenantUrl = `${protocol}://${orgs[0].slug}.${domain}/dashboard`
      return NextResponse.json({ redirect: tenantUrl })
    }

    // Multiple orgs: return the list for the user to choose
    const orgList = orgs.map((o) => ({
      id: o.id,
      name: o.name,
      slug: o.slug,
      url: `${protocol}://${o.slug}.${domain}/dashboard`,
    }))

    return NextResponse.json({
      redirect: null,
      orgs: orgList,
    })
  } catch {
    return NextResponse.json({ redirect: "/login" })
  }
}
