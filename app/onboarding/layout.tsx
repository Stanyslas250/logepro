import type { ReactNode } from "react"
import { OnboardingProvider } from "@/components/onboarding/onboarding-context"
import { OnboardingTopbar } from "@/components/onboarding/topbar"
import { OnboardingAuthGuard } from "@/components/onboarding/auth-guard"

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <OnboardingProvider>
      <OnboardingTopbar />
      <main className="flex min-h-screen flex-col overflow-x-clip">
        <OnboardingAuthGuard>{children}</OnboardingAuthGuard>
      </main>
    </OnboardingProvider>
  )
}
