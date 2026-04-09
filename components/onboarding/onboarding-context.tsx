"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"

export type Plan = "starter" | "pro" | "business"

export const PLAN_ROOM_LIMITS: Record<Plan, number> = {
  starter: 10,
  pro: 50,
  business: 200,
}

export interface Invitation {
  email: string
  role: string
}

interface OnboardingState {
  plan: Plan
  floors: number
  roomsPerFloor: number
  orgName: string
  slug: string
  invitations: Invitation[]
}

interface OnboardingContextValue extends OnboardingState {
  setPlan: (plan: Plan) => void
  setFloors: (floors: number) => void
  setRoomsPerFloor: (rooms: number) => void
  setOrgName: (name: string) => void
  addInvitation: (email: string, role: string) => void
  removeInvitation: (index: number) => void
  totalRooms: number
  maxRooms: number
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

function clampStructure(floors: number, roomsPerFloor: number, max: number) {
  const f = Math.max(1, floors)
  const r = Math.max(1, roomsPerFloor)
  if (f * r <= max) return { floors: f, roomsPerFloor: r }
  const clampedR = Math.max(1, Math.floor(max / f))
  return { floors: f, roomsPerFloor: clampedR }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>({
    plan: "pro",
    floors: 4,
    roomsPerFloor: 8,
    orgName: "",
    slug: "",
    invitations: [],
  })

  const maxRooms = PLAN_ROOM_LIMITS[state.plan]

  const setPlan = useCallback(
    (plan: Plan) =>
      setState((s) => {
        const limit = PLAN_ROOM_LIMITS[plan]
        const { floors, roomsPerFloor } = clampStructure(
          s.floors,
          s.roomsPerFloor,
          limit
        )
        return { ...s, plan, floors, roomsPerFloor }
      }),
    []
  )

  const setOrgName = useCallback(
    (orgName: string) =>
      setState((s) => ({ ...s, orgName, slug: slugify(orgName) })),
    []
  )

  const setFloors = useCallback(
    (floors: number) =>
      setState((s) => {
        const limit = PLAN_ROOM_LIMITS[s.plan]
        return { ...s, ...clampStructure(floors, s.roomsPerFloor, limit) }
      }),
    []
  )

  const setRoomsPerFloor = useCallback(
    (roomsPerFloor: number) =>
      setState((s) => {
        const limit = PLAN_ROOM_LIMITS[s.plan]
        const r = Math.max(1, roomsPerFloor)
        const f = Math.max(1, Math.min(s.floors, Math.floor(limit / r)))
        return { ...s, floors: f, roomsPerFloor: r }
      }),
    []
  )

  const addInvitation = useCallback(
    (email: string, role: string) =>
      setState((s) => ({
        ...s,
        invitations: [...s.invitations, { email, role }],
      })),
    []
  )

  const removeInvitation = useCallback(
    (index: number) =>
      setState((s) => ({
        ...s,
        invitations: s.invitations.filter((_, i) => i !== index),
      })),
    []
  )

  return (
    <OnboardingContext.Provider
      value={{
        ...state,
        setPlan,
        setFloors,
        setRoomsPerFloor,
        setOrgName,
        addInvitation,
        removeInvitation,
        totalRooms: state.floors * state.roomsPerFloor,
        maxRooms,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx)
    throw new Error("useOnboarding must be used within OnboardingProvider")
  return ctx
}
