export function OccupancyChart({
  vacant,
  occupied,
  notReady,
}: {
  vacant: number
  occupied: number
  notReady: number
}) {
  const total = Math.max(vacant + occupied + notReady, 1)
  const occupiedPct = Math.round((occupied / total) * 100)

  const segments = [
    { label: "Occupées", value: occupied, cls: "bg-foreground" },
    { label: "Libres", value: vacant, cls: "bg-foreground/40" },
    { label: "Non prêtes", value: notReady, cls: "bg-foreground/15" },
  ]

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Occupation
        </p>
        <span className="text-[11px] text-muted-foreground">Temps réel</span>
      </div>

      <div>
        <p className="text-[32px] font-semibold leading-none tracking-tight">
          {occupiedPct}
          <span className="ml-0.5 text-xl text-muted-foreground">%</span>
        </p>
        <p className="mt-1 text-[11.5px] text-muted-foreground">
          {occupied} sur {total} chambres occupées
        </p>
      </div>

      <div className="mt-4 flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
        {segments.map((s) => (
          <div
            key={s.label}
            className={`${s.cls} h-full transition-all`}
            style={{ width: `${(s.value / total) * 100}%` }}
          />
        ))}
      </div>

      <div className="mt-auto grid grid-cols-3 gap-2 pt-4">
        {segments.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className={`size-1.5 rounded-full ${s.cls}`} />
              <span className="text-[10.5px] text-muted-foreground">
                {s.label}
              </span>
            </div>
            <span className="text-[13px] font-medium">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
