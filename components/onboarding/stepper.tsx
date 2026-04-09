"use client"

import { cn } from "@/lib/utils"

interface StepperProps {
  currentStep: number
  totalSteps: number
}

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
                isDone && "w-8 bg-emerald-500",
                !isActive && !isDone && "w-8 bg-muted"
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
