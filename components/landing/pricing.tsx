"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckCircleIcon, SparkleIcon } from "./icons"

type Plan = {
  name: string
  price: { monthly: number; yearly: number }
  target: string
  popular: boolean
  features: string[]
  cta: string
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: { monthly: 25000, yearly: 20000 },
    target: "Apparts & motels ≤ 10 chambres",
    popular: false,
    cta: "Commencer",
    features: [
      "Gestion des réservations",
      "Caisse & facturation",
      "Tableau de bord simplifié",
      "1 utilisateur",
      "Support email",
    ],
  },
  {
    name: "Pro",
    price: { monthly: 55000, yearly: 44000 },
    target: "Hôtels 10–50 chambres",
    popular: true,
    cta: "Essai 14 jours offert",
    features: [
      "Tout le plan Starter",
      "Gestion des stocks",
      "Gestion RH & personnel",
      "Rapports avancés & IA",
      "Jusqu'à 10 utilisateurs",
      "Support prioritaire",
    ],
  },
  {
    name: "Business",
    price: { monthly: 100000, yearly: 80000 },
    target: "Hôtels 50+ chambres, multi-sites",
    popular: false,
    cta: "Contacter l'équipe",
    features: [
      "Tout le plan Pro",
      "Multi-établissements",
      "Accès API & intégrations",
      "Utilisateurs illimités",
      "Manager dédié",
      "SLA 99,9%",
    ],
  },
]

export function Pricing() {
  const [yearly, setYearly] = useState(true)

  return (
    <section id="tarifs" className="relative bg-background py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
            Tarification transparente
          </div>
          <h2 className="font-heading text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Un prix pour{" "}
            <span className="italic text-primary">chaque étape</span> de votre
            croissance
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Sans engagement. Évolutif à tout moment. Paiement sécurisé en FCFA.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center rounded-full border border-border/60 bg-card/70 p-1 text-sm backdrop-blur">
            <button
              onClick={() => setYearly(false)}
              className={cn(
                "rounded-full px-4 py-1.5 font-semibold transition-colors",
                !yearly
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Mensuel
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-1.5 font-semibold transition-colors",
                yearly
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Annuel
              <span className="rounded-full bg-(--success)/20 px-1.5 py-0.5 text-[10px] font-bold text-(--success)">
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
          {plans.map((plan) => {
            const price = yearly ? plan.price.yearly : plan.price.monthly
            return (
              <div
                key={plan.name}
                className={cn(
                  "relative flex flex-col rounded-3xl p-8 transition-all",
                  plan.popular
                    ? "bg-linear-to-br from-primary to-chart-2 text-primary-foreground shadow-2xl shadow-primary/30 md:-mt-4 md:-mb-4"
                    : "border border-border/60 bg-card hover:shadow-xl"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-background shadow-lg">
                    <SparkleIcon className="size-3" />
                    Le plus choisi
                  </div>
                )}

                <div>
                  <h3
                    className={cn(
                      "font-heading text-xl font-bold tracking-tight",
                      plan.popular ? "text-primary-foreground" : "text-foreground"
                    )}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={cn(
                      "mt-1 text-sm",
                      plan.popular
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    )}
                  >
                    {plan.target}
                  </p>
                </div>

                <div className="my-8 flex items-baseline gap-1">
                  <span
                    className={cn(
                      "font-heading text-5xl font-extrabold tracking-tight",
                      plan.popular ? "text-primary-foreground" : "text-foreground"
                    )}
                  >
                    {price.toLocaleString("fr-FR")}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      plan.popular
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    )}
                  >
                    FCFA
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      plan.popular
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    /mois
                  </span>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircleIcon
                        className={cn(
                          "mt-0.5 size-5 shrink-0",
                          plan.popular
                            ? "text-primary-foreground"
                            : "text-(--success)"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm",
                          plan.popular
                            ? "text-primary-foreground/90"
                            : "text-foreground"
                        )}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  nativeButton={false}
                  render={<Link href="/onboarding/forfait" />}
                  className={cn(
                    "w-full",
                    plan.popular
                      ? "bg-background text-foreground shadow-lg hover:bg-background/90"
                      : ""
                  )}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </div>
            )
          })}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Besoin d&apos;un plan sur-mesure pour plus de 10 établissements ?{" "}
          <a href="#" className="font-semibold text-primary hover:underline">
            Parlons-en →
          </a>
        </p>
      </div>
    </section>
  )
}
