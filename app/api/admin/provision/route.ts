import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * POST /api/admin/provision
 * Provisions a new tenant schema for an existing organization.
 * Body: { organization_id: string, slug: string }
 * Protected by x-admin-key header.
 */
export async function POST(request: Request) {
  const adminKey = request.headers.get("x-admin-key")
  if (adminKey !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const { organization_id, slug } = await request.json()

    if (!organization_id || !slug) {
      return NextResponse.json(
        { error: "organization_id et slug sont requis" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .schema("platform")
      .rpc("provision_tenant", {
        p_org_id: organization_id,
        p_slug: slug,
      })

    if (error) {
      return NextResponse.json(
        { error: "Échec du provisionnement", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      schema_name: data,
      message: `Schéma ${data} provisionné avec succès.`,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}
