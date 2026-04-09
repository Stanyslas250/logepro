import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { createAdminClient } from "@/lib/supabase/admin"

const BUCKET = "logepro-files"

/**
 * Get the tenant's slug-based storage prefix from the current request context.
 */
async function getTenantPrefix(): Promise<string> {
  const headersList = await headers()
  const schema = headersList.get("x-tenant-schema")

  if (!schema) {
    throw new Error("Tenant non résolu — impossible d'accéder au storage")
  }

  // tenant_hotel_marlin -> hotel-marlin
  return schema.replace("tenant_", "").replace(/_/g, "-")
}

/**
 * Upload a file to the tenant's isolated storage area.
 */
export async function uploadTenantFile(
  folder: string,
  fileName: string,
  file: File | Blob | ArrayBuffer
): Promise<{ path: string; error: string | null }> {
  const prefix = await getTenantPrefix()
  const path = `${prefix}/${folder}/${fileName}`

  const supabase = await createClient()
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true })

  if (error) {
    return { path: "", error: error.message }
  }

  return { path, error: null }
}

/**
 * Get a signed URL for a tenant file (valid for 1 hour by default).
 */
export async function getTenantFileUrl(
  filePath: string,
  expiresIn = 3600
): Promise<string | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filePath, expiresIn)

  if (error || !data) return null
  return data.signedUrl
}

/**
 * List files in a tenant's folder.
 */
export async function listTenantFiles(folder: string) {
  const prefix = await getTenantPrefix()
  const path = `${prefix}/${folder}`

  const supabase = await createClient()
  const { data, error } = await supabase.storage.from(BUCKET).list(path)

  if (error) return []
  return data ?? []
}

/**
 * Delete a tenant file (admin operation).
 */
export async function deleteTenantFile(
  filePath: string
): Promise<{ error: string | null }> {
  const admin = createAdminClient()
  const { error } = await admin.storage.from(BUCKET).remove([filePath])

  return { error: error?.message ?? null }
}
