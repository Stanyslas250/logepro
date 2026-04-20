import { SlidersHorizontal } from "lucide-react"

interface Activity {
  id: string
  type: "complaint" | "request" | "service"
  title: string
  description: string
  time: string
}

interface RecentActivitiesProps {
  activities?: Activity[]
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const defaultActivities: Activity[] = [
    { id: "1", type: "complaint", title: "Plainte résolue", description: "Concierge a résolu une plainte pour bruit — Ch. 204.", time: "10:45" },
    { id: "2", type: "request", title: "Demande de café", description: "La Ch. 305 a demandé un service de café.", time: "09:12" },
  ]

  const list = activities && activities.length > 0 ? activities : defaultActivities

  const dotColor = (type: Activity["type"]) =>
    type === "complaint"
      ? "bg-destructive"
      : type === "request"
        ? "bg-primary"
        : "bg-muted-foreground"

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Activité récente
        </p>
        <button className="inline-flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <SlidersHorizontal className="size-3.5" strokeWidth={1.75} />
        </button>
      </div>

      <ul className="space-y-4">
        {list.map((activity, index) => {
          const isLast = index === list.length - 1
          return (
            <li key={activity.id} className="relative flex gap-3">
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-[5px] top-3 h-full w-px bg-border/80"
                />
              )}
              <span
                className={`relative z-10 mt-1.5 size-2.5 shrink-0 rounded-full ring-4 ring-background ${dotColor(
                  activity.type
                )}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-[12.5px] font-medium text-foreground">
                    {activity.title}
                  </p>
                  <span className="shrink-0 text-[10.5px] text-muted-foreground tabular-nums">
                    {activity.time}
                  </span>
                </div>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {activity.description}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
