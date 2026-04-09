"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const PUBLIC_STEP = "/onboarding/compte"

export function OnboardingAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (pathname === PUBLIC_STEP) {
      setChecked(true)
      return
    }

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace(PUBLIC_STEP)
      } else {
        setChecked(true)
      }
    })
  }, [pathname, router])

  if (pathname === PUBLIC_STEP) return <>{children}</>
  if (!checked) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
