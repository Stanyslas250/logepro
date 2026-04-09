import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { readFileSync } from "fs"
import { join } from "path"

/**
 * POST /api/setup/storage
 * Creates the logepro-files bucket and applies RLS policies.
 * Protected by x-admin-key header.
 */
export async function POST(request: Request) {
  const adminKey = request.headers.get("x-admin-key")
  if (adminKey !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const supabase = createAdminClient()

    const { error: bucketError } = await supabase.storage.createBucket(
      "logepro-files",
      { public: false }
    )

    if (bucketError && !bucketError.message.includes("already exists")) {
      return NextResponse.json(
        { error: "Erreur création bucket", details: bucketError.message },
        { status: 500 }
      )
    }

    const policiesSQL = readFileSync(
      join(process.cwd(), "sql", "storage-policies.sql"),
      "utf-8"
    )

    return NextResponse.json({
      success: true,
      message: "Bucket logepro-files créé.",
      note: "Exécutez les policies RLS manuellement si exec_sql n'est pas disponible.",
      sql_to_run: policiesSQL,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}
