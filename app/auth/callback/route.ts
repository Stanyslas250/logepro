import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * GET /auth/callback
 * Handles the OAuth/magic-link callback from Supabase Auth.
 * Exchanges the code for a session, then resolves the user's tenant slug
 * and redirects accordingly.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const explicitRedirect = searchParams.get("redirect")

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=auth_failed", origin))
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL("/login?error=auth_failed", origin))
  }

  // If an explicit redirect was provided (e.g. from a tenant subdomain), use it
  if (explicitRedirect) {
    return NextResponse.redirect(new URL(explicitRedirect, origin))
  }

  // Otherwise, resolve the user's org and redirect to the right subdomain
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL("/onboarding/forfait", origin))
  }

  const admin = createAdminClient()

  const { data: memberships } = await admin
    .schema("platform")
    .from("memberships")
    .select("organization_id")
    .eq("user_id", user.id)

  if (!memberships || memberships.length === 0) {
    return NextResponse.redirect(new URL("/onboarding/forfait", origin))
  }

  const { data: org } = await admin
    .schema("platform")
    .from("organizations")
    .select("slug, status")
    .eq("id", memberships[0].organization_id)
    .eq("status", "active")
    .single()

  if (!org) {
    return NextResponse.redirect(new URL("/onboarding/forfait", origin))
  }

  const protocol = process.env.NEXT_PUBLIC_PROTOCOL ?? "https"
  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "logepro.app"
  const tenantUrl = `${protocol}://${org.slug}.${domain}/dashboard`

  return NextResponse.redirect(tenantUrl)
}
