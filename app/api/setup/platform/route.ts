import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { readFileSync } from "fs"
import { join } from "path"

/**
 * POST /api/setup/platform
 * Initializes the platform schema. Run once.
 * Protected by SUPABASE_SERVICE_ROLE_KEY header.
 */
export async function POST(request: Request) {
  const adminKey = request.headers.get("x-admin-key")
  if (adminKey !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const supabase = createAdminClient()

    const platformSQL = readFileSync(
      join(process.cwd(), "sql", "platform-schema.sql"),
      "utf-8"
    )

    const { error: schemaError } = await supabase.rpc("exec_sql", {
      query: platformSQL,
    })

    if (schemaError) {
      // Fallback: execute via raw SQL through the REST API
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
          },
          body: JSON.stringify({ query: platformSQL }),
        }
      )

      if (!res.ok) {
        return NextResponse.json(
          {
            error: "Impossible d'exécuter le SQL. Créez d'abord la fonction exec_sql ou exécutez le SQL manuellement dans le dashboard Supabase.",
            details: schemaError.message,
            sql_to_run: platformSQL,
          },
          { status: 500 }
        )
      }
    }

    // Also deploy the provision_tenant function
    const provisionSQL = readFileSync(
      join(process.cwd(), "sql", "provision-tenant.sql"),
      "utf-8"
    )

    const { error: fnError } = await supabase.rpc("exec_sql", {
      query: provisionSQL,
    })

    if (fnError) {
      return NextResponse.json(
        {
          error:
            "Le schéma platform a été créé mais la fonction provision_tenant n'a pas pu être déployée.",
          details: fnError.message,
          sql_to_run: provisionSQL,
        },
        { status: 207 }
      )
    }

    return NextResponse.json({
      success: true,
      message:
        "Schéma platform créé et fonction provision_tenant déployée avec succès.",
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}
