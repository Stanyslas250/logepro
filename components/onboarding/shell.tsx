import type { ReactNode } from "react"

interface OnboardingShellProps {
  children: ReactNode
  /** Largeur max du contenu. Par défaut `max-w-4xl`. */
  maxWidth?: "max-w-2xl" | "max-w-3xl" | "max-w-4xl" | "max-w-5xl" | "max-w-6xl"
}

/**
 * Conteneur visuel de toutes les pages d'onboarding.
 * Reprend le style du Hero du landing : fond grid + blobs aurora.
 */
export function OnboardingShell({
  children,
  maxWidth = "max-w-4xl",
}: OnboardingShellProps) {
  return (
    <section className="relative flex flex-1 flex-col overflow-hidden pt-28 pb-16 md:pt-32">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern mask-radial-faded opacity-60" />
        <div className="absolute left-1/2 top-[-15%] size-[720px] -translate-x-1/2 rounded-full bg-linear-to-br from-primary/25 via-chart-2/15 to-transparent blur-3xl animate-aurora" />
        <div className="absolute right-[-10%] top-[20%] size-[520px] rounded-full bg-linear-to-tr from-chart-1/20 to-transparent blur-3xl animate-aurora [animation-delay:-6s]" />
        <div className="absolute left-[-15%] bottom-[-10%] size-[480px] rounded-full bg-linear-to-tr from-(--success)/15 to-transparent blur-3xl animate-aurora [animation-delay:-12s]" />
      </div>

      <div className={`mx-auto w-full ${maxWidth} px-6`}>{children}</div>
    </section>
  )
}
