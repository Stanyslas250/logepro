import { type NextRequest, NextResponse } from "next/server"
import { createMiddlewareClient } from "@/lib/supabase/middleware"
import { createClient } from "@supabase/supabase-js"

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "logepro.app"
const PROTOCOL = process.env.NEXT_PUBLIC_PROTOCOL ?? "https"
const SPECIAL_SUBDOMAINS = ["app", "www", "api"]

const PUBLIC_PATHS = ["/", "/login", "/signup", "/auth/callback", "/404"]
const ONBOARDING_PREFIX = "/onboarding"

function extractTenantSlug(request: NextRequest): string | null {
  // Dev fallback: ?tenant=hotel-marlin
  const tenantParam = request.nextUrl.searchParams.get("tenant")
  if (tenantParam) return tenantParam

  const hostname = request.headers.get("host") ?? ""

  if (process.env.NODE_ENV === "development") {
    const parts = hostname.split(".")
    if (parts.length > 1 && parts[1].startsWith("localhost")) {
      return parts[0]
    }
    return null
  }

  // Production: <tenant>.<APP_DOMAIN>, ex: hotel-marlin.logepro.app
  // ou hotel-marlin.logepro.aspire.site
  const clean = hostname.replace(/:\d+$/, "").toLowerCase()
  const appDomain = APP_DOMAIN.toLowerCase()

  if (clean === appDomain) return null
  if (clean.endsWith(`.${appDomain}`)) {
    const sub = clean.slice(0, clean.length - appDomain.length - 1).split(".")[0]
    if (SPECIAL_SUBDOMAINS.includes(sub)) return null
    return sub
  }
  return null
}

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true
  if (pathname.startsWith(ONBOARDING_PREFIX)) return true
  if (pathname.startsWith("/admin")) return true
  if (pathname.startsWith("/api/setup")) return true
  if (pathname.startsWith("/api/webhooks")) return true
  return false
}

export async function proxy(request: NextRequest) {
  const slug = extractTenantSlug(request)
  const { supabase: authClient, response } = createMiddlewareClient(request)

  // Refresh the auth session on every request
  const {
    data: { user },
  } = await authClient.auth.getUser()

  // --- No tenant subdomain: platform routes (landing, onboarding, auth) ---
  if (!slug) {
    return response()
  }

  // --- Tenant subdomain: resolve organization ---
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { data: org } = await adminClient
    .schema("platform")
    .from("organizations")
    .select("id, schema_name, status")
    .eq("slug", slug)
    .single()

  if (!org || org.status !== "active") {
    return NextResponse.redirect(
      new URL(`${PROTOCOL}://${APP_DOMAIN}/404`, request.url)
    )
  }

  // Protected tenant routes: require authentication
  const pathname = request.nextUrl.pathname
  if (!isPublicPath(pathname) && !user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Inject tenant headers into the REQUEST so downstream API routes
  // can read them via headers() from "next/headers"
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-tenant-id", org.id)
  requestHeaders.set("x-tenant-schema", org.schema_name)

  const res = NextResponse.next({
    request: { headers: requestHeaders },
  })

  // Preserve auth cookies set by the Supabase middleware client
  const authResponse = response()
  for (const cookie of authResponse.cookies.getAll()) {
    res.cookies.set(cookie)
  }

  return res
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api/webhooks).*)"],
}
