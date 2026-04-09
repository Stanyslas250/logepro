"use client"

import Link from "next/link"
import { useOnboarding, type Plan } from "@/components/onboarding/onboarding-context"
import { Stepper } from "@/components/onboarding/stepper"
import { PlanCard } from "@/components/onboarding/plan-card"

const plans: {
  id: Plan
  tier: string
  name: string
  description: string
  price: string
  recommended?: boolean
  features: { label: string; included: boolean }[]
}[] = [
  {
    id: "starter",
    tier: "Entrée",
    name: "Starter",
    description: "Idéal pour apparts & motels (≤ 10 chambres)",
    price: "25 000",
    features: [
      { label: "Gestion des Réservations", included: true },
      { label: "Gestion de la Caisse", included: true },
      { label: "Rapports Avancés", included: false },
    ],
  },
  {
    id: "pro",
    tier: "Standard",
    name: "Pro",
    description: "Idéal pour hôtels locaux (10–50 chambres)",
    price: "55 000",
    recommended: true,
    features: [
      { label: "Tout le plan Starter", included: true },
      { label: "Gestion de Stock complet", included: true },
      { label: "Module RH & Paie", included: true },
      { label: "Rapports & Analytics", included: true },
    ],
  },
  {
    id: "business",
    tier: "Entreprise",
    name: "Business",
    description: "Hôtels 50+ chambres & Multi-sites",
    price: "100 000",
    features: [
      { label: "Tout le plan Pro", included: true },
      { label: "Console Multi-sites", included: true },
      { label: "API & Intégrations", included: true },
      { label: "Support Prioritaire 24/7", included: true },
    ],
  },
]

const planLabels: Record<Plan, string> = {
  starter: "Starter",
  pro: "Pro Edition",
  business: "Business",
}

export default function ForfaitPage() {
  const { plan, setPlan, orgName, slug, setOrgName } = useOnboarding()

  const canContinue = orgName.trim().length >= 2

  return (
    <div className="flex flex-1 flex-col p-12">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-between">
            <div />
            <Stepper currentStep={2} totalSteps={5} />
          </div>
          <h2 className="font-heading text-4xl font-extrabold tracking-tight">
            Créez votre établissement
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Nommez votre établissement et choisissez le forfait adapté à votre
            activité.
          </p>
        </div>

        {/* Organization Name */}
        <div className="mx-auto mb-10 max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h3 className="font-heading mb-4 text-lg font-bold">
            Nom de l&apos;établissement
          </h3>
          <input
            type="text"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Ex : Hôtel Le Marlin"
            className="h-11 w-full rounded-lg border border-input bg-background px-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
          {slug && (
            <p className="mt-3 text-sm text-muted-foreground">
              Votre sous-domaine :{" "}
              <span className="font-mono font-medium text-primary">
                {slug}.logepro.app
              </span>
            </p>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((p) => (
            <PlanCard
              key={p.id}
              {...p}
              selected={plan === p.id}
              onSelect={setPlan}
            />
          ))}
        </div>

        {/* Footer Action Bar */}
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <svg
                className="size-5 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold">
                {orgName ? (
                  <>
                    {orgName} &mdash;{" "}
                    <span className="font-bold text-primary">
                      {planLabels[plan]}
                    </span>
                  </>
                ) : (
                  <>
                    Forfait :{" "}
                    <span className="font-bold text-primary">
                      {planLabels[plan]}
                    </span>
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                Facturation mensuelle · Inclut tous les modules de base
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/onboarding/compte"
              className="rounded-xl px-6 py-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted"
            >
              Retour
            </Link>
            {canContinue ? (
              <Link
                href="/onboarding/structure"
                className="flex items-center gap-2 rounded-xl bg-primary px-10 py-3 font-bold text-primary-foreground shadow-lg transition-all hover:shadow-primary/30 active:scale-95"
              >
                Continuer vers la structure
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
            ) : (
              <span className="flex cursor-not-allowed items-center gap-2 rounded-xl bg-primary/50 px-10 py-3 font-bold text-primary-foreground">
                Nommez votre établissement
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
