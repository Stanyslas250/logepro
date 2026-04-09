import { HugeiconsIcon } from "@hugeicons/react"
import { SparklesIcon } from "@hugeicons/core-free-icons"

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
  return (
    <div className="bg-card rounded-xl p-6 space-y-6 border border-border shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Réservations
        </h3>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-3xl font-extrabold text-primary">{inHome}</p>
          <p className="text-xs text-muted-foreground font-medium mt-1">En cours</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-extrabold text-foreground">{arrivals}</p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Arrivées</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-extrabold text-foreground">{departures}</p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Départs</p>
        </div>
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={SparklesIcon} size={16} className="text-amber-500" />
          <span className="text-xs font-semibold">Ménage</span>
        </div>
        <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-[10px] font-bold">
          {cleaningTasks} TÂCHES
        </span>
      </div>
    </div>
  )
}
