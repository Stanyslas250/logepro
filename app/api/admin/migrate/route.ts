import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * POST /api/admin/migrate
 * Applies a SQL migration to all active tenant schemas.
 * Body: { sql: string }
 * Protected by x-admin-key header.
 */
export async function POST(request: Request) {
  const adminKey = request.headers.get("x-admin-key")
  if (adminKey !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const { sql } = await request.json()

    if (!sql || typeof sql !== "string") {
      return NextResponse.json(
        { error: "Le champ sql (string) est requis" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Fetch all active tenant schemas
    const { data: orgs, error: orgsError } = await supabase
      .schema("platform")
      .from("organizations")
      .select("schema_name, slug")
      .eq("status", "active")
      .not("schema_name", "is", null)

    if (orgsError) {
      return NextResponse.json(
        { error: "Impossible de lister les organisations", details: orgsError.message },
        { status: 500 }
      )
    }

    const results: { schema: string; success: boolean; error?: string }[] = []

    for (const org of orgs ?? []) {
      const migrationSQL = `
        SET search_path TO ${org.schema_name};
        ${sql}
        SET search_path TO public;
      `

      const { error } = await supabase.rpc("exec_sql", {
        query: migrationSQL,
      })

      results.push({
        schema: org.schema_name,
        success: !error,
        error: error?.message,
      })
    }

    const failed = results.filter((r) => !r.success)

    return NextResponse.json({
      success: failed.length === 0,
      total: results.length,
      failed: failed.length,
      results,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}
