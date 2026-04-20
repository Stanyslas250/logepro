"use client"

import { useState } from "react"
import Link from "next/link"
import { useOnboarding, type Plan } from "@/components/onboarding/onboarding-context"
import { OnboardingShell } from "@/components/onboarding/shell"
import { PlanCard } from "@/components/onboarding/plan-card"
import { ArrowRightIcon, SparkleIcon } from "@/components/landing/icons"
import { cn } from "@/lib/utils"

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
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly")

  const canContinue = orgName.trim().length >= 2

  return (
    <OnboardingShell maxWidth="max-w-6xl">
      {/* Announcement */}
      <div className="mb-6 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
            <SparkleIcon className="size-3" />
            Étape 2 · Forfait
          </span>
          Sans engagement · Changez à tout moment
        </span>
      </div>

      {/* Heading */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
          Un forfait adapté à votre{" "}
          <span className="relative inline-block">
            <span className="bg-linear-to-r from-primary via-chart-2 to-chart-1 bg-clip-text text-transparent">
              établissement
            </span>
            <svg
              className="absolute -bottom-1.5 left-0 w-full text-primary/40"
              viewBox="0 0 300 12"
              fill="none"
              preserveAspectRatio="none"
            >
              <path d="M2 9 Q 75 2, 150 6 T 298 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
          Commencez par nommer votre hôtel, puis choisissez le forfait
          correspondant à votre taille.
        </p>
      </div>

      {/* Organization Name */}
      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-border/40 bg-card/70 p-7 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-chart-2 text-primary-foreground shadow-sm">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21V7l9-4 9 4v14" />
              <path d="M9 21V11h6v10" />
            </svg>
          </div>
          <h3 className="font-heading text-base font-bold">
            Nom de votre établissement
          </h3>
        </div>
        <input
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Ex : Hôtel Le Marlin"
          className="h-12 w-full rounded-lg border border-border/60 bg-background/70 px-4 text-base outline-none backdrop-blur transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {slug ? (
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-1.5 rounded-full bg-(--success)" />
            Votre sous-domaine :{" "}
            <span className="font-mono font-semibold text-primary">
              {slug}.logepro.app
            </span>
          </p>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">
            Le sous-domaine sera généré automatiquement.
          </p>
        )}
      </div>

      {/* Billing toggle */}
      <div className="mt-10 flex justify-center">
        <div className="inline-flex items-center rounded-full border border-border/60 bg-card/70 p-1 backdrop-blur-md">
          <button
            onClick={() => setBilling("monthly")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
              billing === "monthly"
                ? "bg-linear-to-r from-primary to-chart-2 text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
              billing === "yearly"
                ? "bg-linear-to-r from-primary to-chart-2 text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Annuel
            <span className="rounded-full bg-(--success)/15 px-1.5 py-0.5 text-[9px] font-bold text-(--success)">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <PlanCard
            key={p.id}
            {...p}
            selected={plan === p.id}
            onSelect={setPlan}
          />
        ))}
      </div>

      {/* Sticky action bar */}
      <div className="sticky bottom-4 mt-10 rounded-2xl border border-border/40 bg-card/80 p-4 shadow-2xl shadow-primary/10 backdrop-blur-xl md:p-5">
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-chart-2/20 text-primary">
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {orgName ? (
                  <>
                    {orgName} ·{" "}
                    <span className="bg-linear-to-r from-primary to-chart-2 bg-clip-text font-bold text-transparent">
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
                Facturation {billing === "yearly" ? "annuelle (-20%)" : "mensuelle"} · Tous les modules de base
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/onboarding/compte"
              className="rounded-xl border border-border/60 bg-card/60 px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Retour
            </Link>
            {canContinue ? (
              <Link
                href="/onboarding/structure"
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-primary to-chart-2 px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Continuer
                <ArrowRightIcon className="size-4" />
              </Link>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-primary/40 px-6 py-2.5 text-sm font-bold text-primary-foreground">
                Nommez votre hôtel
              </span>
            )}
          </div>
        </div>
      </div>
    </OnboardingShell>
  )
}
