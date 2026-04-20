import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface RevenueCardProps {
  last30Days: number
  yesterday: number
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n)
}

export function RevenueCard({ last30Days, yesterday }: RevenueCardProps) {
  // Rough delta: yesterday vs 30d daily average
  const dailyAvg = last30Days / 30
  const deltaPct =
    dailyAvg > 0 ? Math.round(((yesterday - dailyAvg) / dailyAvg) * 100) : 0
  const positive = deltaPct >= 0

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Revenus
        </p>
        <span className="text-[11px] text-muted-foreground">30 derniers jours</span>
      </div>

      <p className="text-[32px] font-semibold leading-none tracking-tight">
        {formatCurrency(last30Days)}
      </p>

      <div className="mt-1.5 flex items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-0.5 text-[11.5px] font-medium ${
            positive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
          }`}
        >
          {positive ? (
            <ArrowUpRight className="size-3" strokeWidth={2} />
          ) : (
            <ArrowDownRight className="size-3" strokeWidth={2} />
          )}
          {Math.abs(deltaPct)}%
        </span>
        <span className="text-[11.5px] text-muted-foreground">vs moyenne quotidienne</span>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
        <span className="text-[12px] text-muted-foreground">Hier</span>
        <span className="text-[13px] font-medium">{formatCurrency(yesterday)}</span>
      </div>
    </div>
  )
}
