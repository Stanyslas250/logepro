"use client"

import { cn } from "@/lib/utils"

interface StepDef {
  label: string
  href: string
}

interface HorizontalStepperProps {
  steps: StepDef[]
  /** Index (0-based) de l'étape active */
  current: number
}

/**
 * Stepper horizontal avec cercles connectés par des lignes.
 * Les étapes complétées affichent un check, l'étape active est mise en avant avec un halo,
 * les étapes à venir sont en muted.
 */
export function HorizontalStepper({ steps, current }: HorizontalStepperProps) {
  return (
    <ol className="flex w-full items-center justify-between">
      {steps.map((step, i) => {
        const isDone = i < current
        const isActive = i === current
        const isLast = i === steps.length - 1

        return (
          <li key={step.href} className="flex flex-1 items-center last:flex-initial">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "relative flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all",
                  isActive &&
                    "bg-linear-to-br from-primary to-chart-2 text-primary-foreground shadow-lg shadow-primary/40 ring-4 ring-primary/15",
                  isDone && "bg-(--success) text-primary-foreground",
                  !isActive && !isDone &&
                    "border border-border/60 bg-card/60 text-muted-foreground"
                )}
              >
                {isDone ? (
                  <svg
                    width="14"
                    height="14"
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
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  "hidden text-[10px] font-semibold uppercase tracking-wider md:block",
                  isActive && "text-foreground",
                  isDone && "text-(--success)",
                  !isActive && !isDone && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-border/60 md:mx-3">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    isDone
                      ? "w-full bg-linear-to-r from-(--success) to-primary"
                      : "w-0"
                  )}
                />
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

/* ------------------------------------------------------------------ */
/* Legacy API — conservée pour compatibilité                           */
/* ------------------------------------------------------------------ */

interface StepperProps {
  currentStep: number
  totalSteps: number
}

/** @deprecated Utiliser `<HorizontalStepper />` via la topbar. */
export function Stepper({ currentStep, totalSteps }: StepperProps) {
  return (
    <div className="text-right">
      <span className="text-xs font-bold uppercase tracking-widest text-primary">
        Étape {currentStep} de {totalSteps}
      </span>
      <div className="mt-2 flex justify-end gap-1">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1
          const isDone = step < currentStep
          const isActive = step === currentStep
          return (
            <div
              key={step}
              className={cn(
                "h-1.5 rounded-full",
                isActive && "w-12 bg-primary shadow-sm shadow-primary/30",
                isDone && "w-8 bg-(--success)",
                !isActive && !isDone && "w-8 bg-muted"
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
