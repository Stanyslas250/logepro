"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HorizontalStepper } from "./stepper"

const steps = [
  { label: "Compte", href: "/onboarding/compte" },
  { label: "Forfait", href: "/onboarding/forfait" },
  { label: "Structure", href: "/onboarding/structure" },
  { label: "Équipe", href: "/onboarding/acces" },
  { label: "Révision", href: "/onboarding/revision" },
]

function stepIndex(pathname: string) {
  const i = steps.findIndex((s) => pathname.startsWith(s.href))
  return i === -1 ? 0 : i
}

export function OnboardingTopbar() {
  const pathname = usePathname()
  const current = stepIndex(pathname)

  return (
    <nav className="fixed inset-x-0 top-0 z-50 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 shadow-lg shadow-black/5 backdrop-blur-xl md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-primary to-chart-2 shadow-lg shadow-primary/30">
            <span className="absolute inset-0 bg-linear-to-tr from-white/30 via-transparent to-transparent" />
            <span className="relative font-heading text-base font-black text-primary-foreground">
              L
            </span>
          </span>
          <span className="hidden font-heading text-lg font-bold tracking-tight text-foreground sm:inline">
            LogePro
          </span>
        </Link>

        {/* Stepper */}
        <div className="flex-1 px-2">
          <HorizontalStepper steps={steps} current={current} />
        </div>

        {/* Exit */}
        <Link
          href="/"
          className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Quitter
        </Link>
      </div>
    </nav>
  )
}
