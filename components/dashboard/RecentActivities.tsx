import { HugeiconsIcon } from "@hugeicons/react"
import { FilterIcon } from "@hugeicons/core-free-icons"

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
    {
      id: "1",
      type: "complaint",
      title: "Faire preuve d'empathie",
      description: "Le concierge a résolu une plainte pour bruit dans la Chambre 204.",
      time: "10:45",
    },
    {
      id: "2",
      type: "request",
      title: "Demande de café",
      description: "La Chambre 305 a demandé un service de café artisanal.",
      time: "09:12",
    },
  ]

  const activityList = activities || defaultActivities

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "complaint":
        return "border-primary bg-primary ring-4 ring-primary/10"
      case "request":
        return "border-emerald-600 bg-emerald-600 ring-4 ring-emerald-600/10"
      default:
        return "border-muted bg-muted ring-4 ring-muted/10"
    }
  }

  const getActivityLineColor = (type: Activity["type"]) => {
    switch (type) {
      case "complaint":
        return "bg-primary/20"
      case "request":
        return "bg-emerald-600/20"
      default:
        return "bg-muted/20"
    }
  }

  return (
    <div className="bg-card rounded-xl p-6 space-y-4 border border-border shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Activités récentes
        </h3>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <HugeiconsIcon icon={FilterIcon} size={16} />
        </button>
      </div>

      <div className="space-y-6">
        {activityList.map((activity, index) => {
          const isLast = index === activityList.length - 1

          return (
            <div key={activity.id} className="flex gap-4 relative">
              {!isLast && (
                <div className={`absolute left-2 top-6 w-0.5 h-12 ${getActivityLineColor(activity.type)}`} />
              )}
              <div className={`z-10 w-4 h-4 rounded-full border-2 ${getActivityColor(activity.type)}`} />
              <div className="flex-1 -mt-1">
                <div className="flex justify-between">
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    {activity.title}
                  </p>
                  <span className="text-[10px] text-muted-foreground">{activity.time}</span>
                </div>
                <p className="text-sm mt-1">{activity.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
