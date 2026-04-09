import { NextRequest, NextResponse } from "next/server"
import { getTenantClient } from "@/lib/supabase/tenant"
import { getCurrentUser } from "@/lib/auth/get-user"
import { headers } from "next/headers"

/**
 * GET /api/rooms/available
 * Returns rooms available for a given date range.
 * Query params: check_in, check_out, type?
 */
export async function GET(request: NextRequest) {
  const headersList = await headers()
  const tenantId = headersList.get("x-tenant-id")
  const user = await getCurrentUser(tenantId)
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const supabase = await getTenantClient()
  const { searchParams } = request.nextUrl
  const checkIn = searchParams.get("check_in")
  const checkOut = searchParams.get("check_out")
  const roomType = searchParams.get("type")

  // Get all rooms
  let roomsQuery = supabase
    .from("rooms")
    .select("*")
    .order("floor", { ascending: true })
    .order("number", { ascending: true })

  if (roomType && roomType !== "all") {
    roomsQuery = roomsQuery.eq("type", roomType)
  }

  const { data: allRooms, error: roomsError } = await roomsQuery

  if (roomsError) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des chambres", details: roomsError.message },
      { status: 500 }
    )
  }

  // If dates are provided, filter out rooms with overlapping reservations
  if (checkIn && checkOut) {
    const { data: overlapping } = await supabase
      .from("reservations")
      .select("room_id")
      .in("status", ["confirmed", "checked_in", "pending"])
      .lt("check_in", checkOut)
      .gt("check_out", checkIn)

    const bookedRoomIds = new Set(overlapping?.map((r) => r.room_id) ?? [])

    const availableRooms = (allRooms ?? []).filter(
      (room) => !bookedRoomIds.has(room.id) && room.status !== "maintenance"
    )

    return NextResponse.json({ rooms: availableRooms })
  }

  // No dates → return all non-maintenance rooms
  const availableRooms = (allRooms ?? []).filter(
    (room) => room.status !== "maintenance"
  )

  return NextResponse.json({ rooms: availableRooms })
}
