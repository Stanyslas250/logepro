"use client"

import { cn } from "@/lib/utils"
import type { Plan } from "./onboarding-context"

interface Feature {
  label: string
  included: boolean
}

interface PlanCardProps {
  id: Plan
  tier: string
  name: string
  description: string
  price: string
  features: Feature[]
  recommended?: boolean
  selected: boolean
  onSelect: (plan: Plan) => void
}

export function PlanCard({
  id,
  tier,
  name,
  description,
  price,
  features,
  recommended,
  selected,
  onSelect,
}: PlanCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-card/70 p-7 backdrop-blur-xl transition-all",
        selected
          ? "gradient-border z-10 border-transparent shadow-2xl shadow-primary/20"
          : "border-border/50 hover:-translate-y-1 hover:border-border hover:shadow-xl"
      )}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-primary to-chart-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/30">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l2.39 5.26L20 9l-5.26 2.39L12 17l-2.39-5.26L4 9l5.61-1.74L12 2z" />
            </svg>
            Recommandé
          </span>
        </div>
      )}

      <div className="mb-6">
        <span
          className={cn(
            "inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest",
            selected
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
          )}
        >
          {tier}
        </span>
        <h3 className="font-heading mt-4 text-2xl font-extrabold tracking-tight">
          {name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              "font-heading text-4xl font-extrabold tracking-tight",
              selected &&
                "bg-linear-to-r from-primary via-chart-2 to-chart-1 bg-clip-text text-transparent"
            )}
          >
            {price}
          </span>
          <span className="text-sm font-semibold text-muted-foreground">
            FCFA/mois
          </span>
        </div>
      </div>

      <div className="mb-8 grow space-y-3 border-t border-border/50 pt-6">
        {features.map((f) => (
          <div
            key={f.label}
            className={cn(
              "flex items-start gap-2.5",
              !f.included && "opacity-40"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                f.included
                  ? "bg-(--success)/15 text-(--success)"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {f.included ? (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              )}
            </span>
            <span className="text-sm leading-tight">{f.label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onSelect(id)}
        className={cn(
          "w-full rounded-xl px-4 py-3 text-sm font-bold transition-all active:scale-[0.98]",
          selected
            ? "bg-linear-to-r from-primary to-chart-2 text-primary-foreground shadow-lg shadow-primary/30"
            : "bg-muted text-foreground hover:bg-primary/10 hover:text-primary"
        )}
      >
        {selected ? "Forfait sélectionné" : "Choisir ce forfait"}
      </button>
    </div>
  )
}
