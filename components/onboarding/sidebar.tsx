"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const steps = [
  {
    label: "Choix du forfait",
    href: "/onboarding/forfait",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    label: "Structure hôtelière",
    href: "/onboarding/structure",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 21V7l9-4 9 4v14" />
        <path d="M9 21V11h6v10" />
      </svg>
    ),
  },
  {
    label: "Accès utilisateurs",
    href: "/onboarding/acces",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Révision",
    href: "/onboarding/revision",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
]

function stepIndex(pathname: string) {
  return steps.findIndex((s) => pathname.startsWith(s.href))
}

export function OnboardingSidebar() {
  const pathname = usePathname()
  const current = stepIndex(pathname)

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-full w-72 flex-col border-r border-border bg-card p-6">
      <div className="mb-10">
        <Link
          href="/"
          className="font-heading text-lg font-bold tracking-tighter text-foreground"
        >
          LogePro
        </Link>
        <div className="mt-8 flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21V7l9-4 9 4v14" />
              <path d="M9 21V11h6v10" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">
              Guide de configuration
            </h2>
            <p className="text-xs text-muted-foreground">
              Progression de l&apos;onboarding
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {steps.map((step, i) => {
          const isActive = i === current
          const isDone = i < current

          return (
            <Link
              key={step.href}
              href={step.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all",
                isActive &&
                  "border-l-4 border-primary bg-card font-bold text-primary shadow-sm",
                isDone && "text-muted-foreground opacity-60",
                !isActive && !isDone && "text-muted-foreground hover:text-primary"
              )}
            >
              <span className="shrink-0">{step.icon}</span>
              <span>{step.label}</span>
              {isDone && (
                <svg
                  className="ml-auto size-4 text-emerald-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              )}
            </Link>
          )
        })}
      </nav>

      <Link
        href="/"
        className="mt-auto rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90"
      >
        Sauvegarder
      </Link>
    </aside>
  )
}
