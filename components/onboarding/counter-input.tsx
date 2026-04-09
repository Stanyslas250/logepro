"use client"

import { cn } from "@/lib/utils"

interface CounterInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  accentClass?: string
}

export function CounterInput({
  value,
  onChange,
  min = 1,
  max = 99,
  accentClass = "text-primary hover:bg-primary",
}: CounterInputProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-muted p-2">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(
          "flex size-12 items-center justify-center rounded-xl bg-card shadow-sm transition-all active:scale-95 disabled:opacity-30",
          accentClass,
          "hover:text-primary-foreground"
        )}
      >
        <svg
          className="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M5 12h14" />
        </svg>
      </button>
      <span className="font-heading text-3xl font-bold">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          "flex size-12 items-center justify-center rounded-xl bg-card shadow-sm transition-all active:scale-95 disabled:opacity-30",
          accentClass,
          "hover:text-primary-foreground"
        )}
      >
        <svg
          className="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      </button>
    </div>
  )
}
