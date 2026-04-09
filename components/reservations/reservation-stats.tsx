interface ReservationStatsProps {
  arrivalsToday: number
  occupancyRate: number
  projectedRevenue: number
}

export function ReservationStats({
  arrivalsToday,
  occupancyRate,
  projectedRevenue,
}: ReservationStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-primary text-primary-foreground p-6 rounded-xl flex flex-col justify-between shadow-lg">
        <div className="flex justify-between items-start">
          <span className="material-symbols-outlined opacity-80">
            event_available
          </span>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-extrabold font-heading leading-none">
            {arrivalsToday}
          </p>
          <p className="text-xs font-medium opacity-80 mt-1">
            Arrivées aujourd&apos;hui
          </p>
        </div>
      </div>

      <div className="bg-emerald-600 text-white p-6 rounded-xl flex flex-col justify-between shadow-lg">
        <div className="flex justify-between items-start">
          <span className="material-symbols-outlined opacity-80">hotel</span>
          <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full">
            {occupancyRate >= 80 ? "Optimal" : "Normal"}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-extrabold font-heading leading-none">
            {occupancyRate}%
          </p>
          <p className="text-xs font-medium opacity-80 mt-1">
            Taux d&apos;occupation
          </p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-xl flex flex-col justify-between border border-border">
        <div className="flex justify-between items-start">
          <span className="material-symbols-outlined text-primary">
            payments
          </span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            Revenu
          </span>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-extrabold font-heading leading-none">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "XAF",
              maximumFractionDigits: 0,
            }).format(projectedRevenue)}
          </p>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            CA prévisionnel (J)
          </p>
        </div>
      </div>
    </div>
  )
}
