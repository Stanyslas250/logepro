import { createClient } from "@supabase/supabase-js"
import { headers } from "next/headers"

/**
 * Returns a Supabase client scoped to the current tenant's schema.
 * Reads `x-tenant-schema` injected by the middleware.
 */
export async function getTenantClient() {
  const headersList = await headers()
  const schema = headersList.get("x-tenant-schema")

  if (!schema) {
    throw new Error("Tenant non résolu — header x-tenant-schema manquant")
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      db: { schema },
      auth: { persistSession: false, autoRefreshToken: false },
    }
  )
}

/**
 * Returns the current tenant metadata from middleware headers.
 */
export async function getTenantInfo() {
  const headersList = await headers()
  const tenantId = headersList.get("x-tenant-id")
  const tenantSchema = headersList.get("x-tenant-schema")

  if (!tenantId || !tenantSchema) {
    return null
  }

  return { tenantId, tenantSchema }
}
