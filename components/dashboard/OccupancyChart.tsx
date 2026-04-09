export function OccupancyChart({
  vacant,
  occupied,
  notReady,
}: {
  vacant: number
  occupied: number
  notReady: number
}) {
  const total = vacant + occupied + notReady
  const vacantPercent = (vacant / total) * 100
  const occupiedPercent = (occupied / total) * 100
  const notReadyPercent = (notReady / total) * 100

  return (
    <div className="bg-card rounded-xl p-6 space-y-6 border border-border shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Taux d'occupation
        </h3>
        <span className="text-xs font-bold text-primary">En direct</span>
      </div>

      <div className="flex h-12 w-full rounded-full overflow-hidden bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${vacantPercent}%` }}
        />
        <div
          className="h-full bg-emerald-400 transition-all duration-500"
          style={{ width: `${occupiedPercent}%` }}
        />
        <div
          className="h-full bg-amber-400 transition-all duration-500"
          style={{ width: `${notReadyPercent}%` }}
        />
      </div>

      <div className="grid grid-cols-3 text-center">
        <div>
          <p className="text-xl font-bold">{vacant}</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
              Libre
            </span>
          </div>
        </div>
        <div>
          <p className="text-xl font-bold">{occupied}</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
              Occupé
            </span>
          </div>
        </div>
        <div>
          <p className="text-xl font-bold">{notReady}</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
              Non prêt
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
