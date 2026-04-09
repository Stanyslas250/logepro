import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * POST /api/onboarding/complete
 * Provisions a new organization: creates org, schema, membership, and rooms.
 * Requires authenticated user.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      )
    }

    const { orgName, slug, plan, floors, roomsPerFloor } = await request.json()

    if (!orgName || !slug) {
      return NextResponse.json(
        { error: "Le nom et le slug de l'établissement sont requis" },
        { status: 400 }
      )
    }

    const admin = createAdminClient()

    // Check slug uniqueness
    const { data: existing } = await admin
      .schema("platform")
      .from("organizations")
      .select("id")
      .eq("slug", slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "Ce nom d'établissement est déjà pris. Choisissez un autre nom." },
        { status: 409 }
      )
    }

    // 1. Create the organization
    const schemaName = "tenant_" + slug.replace(/-/g, "_")
    const { data: org, error: orgError } = await admin
      .schema("platform")
      .from("organizations")
      .insert({
        name: orgName,
        slug,
        schema_name: schemaName,
        plan: plan ?? "pro",
        status: "provisioning",
      })
      .select()
      .single()

    if (orgError || !org) {
      return NextResponse.json(
        { error: "Impossible de créer l'organisation", details: orgError?.message },
        { status: 500 }
      )
    }

    // 2. Provision the tenant schema
    const { data: provisionedSchema, error: provisionError } = await admin
      .schema("platform")
      .rpc("provision_tenant", { p_org_id: org.id, p_slug: slug })

    if (provisionError) {
      // Cleanup: delete the org if provisioning fails
      await admin
        .schema("platform")
        .from("organizations")
        .delete()
        .eq("id", org.id)

      return NextResponse.json(
        {
          error: "Échec du provisionnement du schéma",
          details: provisionError.message,
        },
        { status: 500 }
      )
    }

    // 3. Create the owner membership
    const { error: memberError } = await admin
      .schema("platform")
      .from("memberships")
      .insert({
        user_id: user.id,
        organization_id: org.id,
        role: "owner",
      })

    if (memberError) {
      return NextResponse.json(
        { error: "Impossible de créer le membership", details: memberError.message },
        { status: 500 }
      )
    }

    // 4. Create initial rooms in the tenant schema
    if (floors && roomsPerFloor) {
      const tenantClient = createAdminClient()
      const rooms = []

      for (let floor = 1; floor <= floors; floor++) {
        for (let room = 1; room <= roomsPerFloor; room++) {
          rooms.push({
            number: `${floor}${String(room).padStart(2, "0")}`,
            floor,
            type: "standard",
            capacity: 2,
            rate: 0,
            status: "available",
          })
        }
      }

      // Use raw SQL to insert into the tenant schema
      const values = rooms
        .map(
          (r) =>
            `('${r.number}', ${r.floor}, '${r.type}', ${r.capacity}, ${r.rate}, '${r.status}')`
        )
        .join(", ")

      await tenantClient.rpc("exec_sql", {
        query: `INSERT INTO ${provisionedSchema}.rooms (number, floor, type, capacity, rate, status) VALUES ${values}`,
      })
    }

    // Build the tenant URL
    const protocol = process.env.NEXT_PUBLIC_PROTOCOL ?? "https"
    const domain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "logepro.app"
    const tenantUrl = `${protocol}://${slug}.${domain}`

    return NextResponse.json({
      success: true,
      organization: {
        id: org.id,
        name: orgName,
        slug,
        schema_name: provisionedSchema,
      },
      tenantUrl,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    )
  }
}
