"use client"

import Link from "next/link"
import { useOnboarding } from "@/components/onboarding/onboarding-context"
import { Stepper } from "@/components/onboarding/stepper"

const planLabels = {
  starter: "Starter",
  pro: "Pro Edition",
  business: "Business",
} as const

export default function RevisionPage() {
  const { plan, floors, roomsPerFloor, totalRooms } = useOnboarding()

  return (
    <div className="flex flex-1 flex-col p-10">
      <header className="mx-auto mb-12 w-full max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight">
              Révision
            </h1>
            <p className="mt-2 text-muted-foreground">
              Vérifiez vos choix avant de finaliser la configuration.
            </p>
          </div>
          <Stepper currentStep={4} totalSteps={4} />
        </div>
      </header>

      <section className="mx-auto w-full max-w-5xl flex-1 space-y-6">
        {/* Plan Summary */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <h3 className="font-heading mb-4 text-lg font-bold">Forfait choisi</h3>
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg
                className="size-5"
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
            </div>
            <div>
              <p className="text-lg font-bold text-primary">
                {planLabels[plan]}
              </p>
              <p className="text-sm text-muted-foreground">
                Facturation mensuelle
              </p>
            </div>
          </div>
        </div>

        {/* Structure Summary */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <h3 className="font-heading mb-4 text-lg font-bold">
            Structure de l&apos;établissement
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="font-heading text-3xl font-bold text-primary">
                {floors}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Étages</p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="font-heading text-3xl font-bold text-primary">
                {roomsPerFloor}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Chambres / étage
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="font-heading text-3xl font-bold text-primary">
                {totalRooms}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Capacité totale
              </p>
            </div>
          </div>
        </div>

        {/* Coming soon */}
        <div className="flex items-center gap-4 rounded-xl bg-primary/5 p-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <p className="text-sm leading-snug text-muted-foreground">
            La création de votre établissement sera bientôt disponible. Cette
            page vous permettra de confirmer et lancer la mise en service.
          </p>
        </div>
      </section>

      <footer className="mx-auto mt-auto flex w-full max-w-5xl items-center justify-between border-t border-border py-10">
        <Link
          href="/onboarding/acces"
          className="flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-muted-foreground transition-all hover:bg-muted"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Retour
        </Link>
        <button
          disabled
          className="flex items-center gap-3 rounded-xl bg-primary px-8 py-4 font-bold text-primary-foreground opacity-50 shadow-xl shadow-primary/20"
        >
          Créer mon établissement
          <svg
            className="size-4"
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
        </button>
      </footer>
    </div>
  )
}
