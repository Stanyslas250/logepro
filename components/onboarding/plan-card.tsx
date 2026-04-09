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
        "relative flex flex-col overflow-hidden rounded-xl bg-card p-8 transition-all",
        selected
          ? "z-10 scale-105 shadow-2xl ring-2 ring-primary"
          : "hover:-translate-y-1 hover:shadow-xl"
      )}
    >
      {recommended && (
        <div className="absolute right-0 top-0">
          <div className="translate-x-6 translate-y-3 rotate-45 bg-primary px-8 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
            Recommandé
          </div>
        </div>
      )}

      <div className="mb-6">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest",
            selected
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          )}
        >
          {tier}
        </span>
        <h3 className="font-heading mt-4 text-2xl font-bold">{name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              "font-heading text-4xl font-extrabold",
              selected && "text-primary"
            )}
          >
            {price}
          </span>
          <span className="font-semibold text-muted-foreground">FCFA/mois</span>
        </div>
      </div>

      <div className="mb-10 flex-grow space-y-4">
        {features.map((f) => (
          <div
            key={f.label}
            className={cn(
              "flex items-start gap-3",
              !f.included && "text-muted-foreground/50"
            )}
          >
            {f.included ? (
              <svg
                className="mt-0.5 size-5 shrink-0 text-emerald-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            ) : (
              <svg
                className="mt-0.5 size-5 shrink-0 text-muted"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
              </svg>
            )}
            <span
              className={cn("text-sm", f.included ? "font-medium" : "font-normal")}
            >
              {f.label}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onSelect(id)}
        className={cn(
          "w-full rounded-xl px-4 py-3 text-sm font-bold transition-colors active:scale-95",
          selected
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            : "bg-muted text-muted-foreground hover:bg-primary/10"
        )}
      >
        {selected ? "Forfait sélectionné" : "Choisir ce forfait"}
      </button>
    </div>
  )
}
