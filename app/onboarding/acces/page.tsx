"use client"

import Link from "next/link"
import { Stepper } from "@/components/onboarding/stepper"

export default function AccesPage() {
  return (
    <div className="flex flex-1 flex-col p-10">
      <header className="mx-auto mb-12 w-full max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight">
              Accès utilisateurs
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configurez les rôles et permissions de votre équipe.
            </p>
          </div>
          <Stepper currentStep={3} totalSteps={4} />
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-border bg-muted/50 px-16 py-20 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <svg
              className="size-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h2 className="font-heading text-2xl font-bold">
            Bientôt disponible
          </h2>
          <p className="max-w-md text-muted-foreground">
            La configuration des accès utilisateurs sera disponible
            prochainement. Vous pourrez inviter vos collaborateurs et définir
            leurs rôles (réceptionniste, ménage, comptable).
          </p>
        </div>
      </section>

      <footer className="mx-auto mt-auto flex w-full max-w-5xl items-center justify-between border-t border-border py-10">
        <Link
          href="/onboarding/structure"
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
        <Link
          href="/onboarding/revision"
          className="flex items-center gap-3 rounded-xl bg-primary px-8 py-4 font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          Passer à la révision
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </footer>
    </div>
  )
}
