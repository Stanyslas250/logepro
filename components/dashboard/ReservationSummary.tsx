import { Sparkles } from "lucide-react"

interface ReservationSummaryProps {
  inHome: number
  arrivals: number
  departures: number
  cleaningTasks: number
}

export function ReservationSummary({
  inHome,
  arrivals,
  departures,
  cleaningTasks,
}: ReservationSummaryProps) {
  const items = [
    { label: "En cours", value: inHome, accent: true },
    { label: "Arrivées", value: arrivals },
    { label: "Départs", value: departures },
  ]

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Réservations
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {items.map((it) => (
          <div key={it.label}>
            <p
              className={`text-[26px] font-semibold tracking-tight leading-none ${
                it.accent ? "text-foreground" : "text-foreground"
              }`}
            >
              {it.value}
            </p>
            <p className="mt-1.5 text-[11.5px] text-muted-foreground">
              {it.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <Sparkles className="size-3.5" strokeWidth={1.75} />
          <span>Ménage en attente</span>
        </div>
        <span className="text-[12px] font-medium text-foreground">
          {cleaningTasks}
        </span>
      </div>
    </div>
  )
}
