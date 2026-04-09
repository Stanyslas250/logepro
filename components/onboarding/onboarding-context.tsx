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

interface OnboardingState {
  plan: Plan
  floors: number
  roomsPerFloor: number
}

interface OnboardingContextValue extends OnboardingState {
  setPlan: (plan: Plan) => void
  setFloors: (floors: number) => void
  setRoomsPerFloor: (rooms: number) => void
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

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>({
    plan: "pro",
    floors: 4,
    roomsPerFloor: 8,
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
        return { plan, floors, roomsPerFloor }
      }),
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

  return (
    <OnboardingContext.Provider
      value={{
        ...state,
        setPlan,
        setFloors,
        setRoomsPerFloor,
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
