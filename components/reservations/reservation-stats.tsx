import { CalendarCheck, Hotel, Wallet } from "lucide-react"

interface ReservationStatsProps {
  arrivalsToday: number
  occupancyRate: number
  projectedRevenue: number
}

function Kpi({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  hint?: string
}) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <Icon className="size-4 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <p className="text-[26px] font-semibold leading-none tracking-tight">
        {value}
      </p>
      {hint && (
        <p className="mt-1.5 text-[11.5px] text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}

export function ReservationStats({
  arrivalsToday,
  occupancyRate,
  projectedRevenue,
}: ReservationStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Kpi
        label="Arrivées"
        value={arrivalsToday}
        icon={CalendarCheck}
        hint="Aujourd'hui"
      />
      <Kpi
        label="Occupation"
        value={`${occupancyRate}%`}
        icon={Hotel}
        hint={occupancyRate >= 80 ? "Taux optimal" : "Taux normal"}
      />
      <Kpi
        label="CA prévisionnel"
        value={new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "XAF",
          maximumFractionDigits: 0,
        }).format(projectedRevenue)}
        icon={Wallet}
        hint="Estimé sur les arrivées du jour"
      />
    </div>
  )
}
