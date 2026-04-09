import type { ReactNode } from "react"
import { OnboardingProvider } from "@/components/onboarding/onboarding-context"
import { OnboardingSidebar } from "@/components/onboarding/sidebar"
import { OnboardingAuthGuard } from "@/components/onboarding/auth-guard"

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <OnboardingProvider>
      <OnboardingSidebar />
      <main className="ml-72 min-h-screen flex flex-col">
        <OnboardingAuthGuard>{children}</OnboardingAuthGuard>
      </main>
    </OnboardingProvider>
  )
}
