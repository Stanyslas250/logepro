import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface BookingEvent {
  id: string
  guestName: string
  roomType: string
  roomNumber: string
  date: number
  day: string
  status: "arrival" | "departure" | "none"
}

interface CalendarWidgetProps {
  events?: BookingEvent[]
}

export function CalendarWidget({ events }: CalendarWidgetProps) {
  const defaultEvents: BookingEvent[] = [
    { id: "1", guestName: "Jean Dupont", roomType: "Deluxe King", roomNumber: "Ch. 302", date: 20, day: "Lun", status: "arrival" },
    { id: "2", guestName: "Marie Laurent", roomType: "Suite", roomNumber: "Ch. 104", date: 21, day: "Mar", status: "departure" },
    { id: "3", guestName: "", roomType: "", roomNumber: "", date: 22, day: "Mer", status: "none" },
  ]

  const bookingEvents = events || defaultEvents

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Planning
        </p>
        <span className="text-[11px] text-muted-foreground">
          {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
        </span>
      </div>

      <div className="space-y-2">
        {bookingEvents.map((event) => {
          const empty = event.status === "none"
          return (
            <div
              key={event.id}
              className="flex items-center gap-3 rounded-md border border-border/60 px-3 py-2"
            >
              <div className="flex min-w-[34px] flex-col items-center">
                <span className="text-[10px] uppercase text-muted-foreground">
                  {event.day}
                </span>
                <span
                  className={`text-[15px] font-semibold tabular-nums ${
                    empty ? "text-muted-foreground/40" : "text-foreground"
                  }`}
                >
                  {event.date}
                </span>
              </div>
              {empty ? (
                <span className="text-[11.5px] italic text-muted-foreground">
                  Aucune arrivée prévue
                </span>
              ) : (
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-medium text-foreground">
                      {event.guestName}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {event.roomType} · {event.roomNumber}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9.5px] uppercase tracking-wide ${
                      event.status === "arrival"
                        ? "border-primary/30 text-primary"
                        : "border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {event.status === "arrival" ? "Arrivée" : "Départ"}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Link
        href="/reservations"
        className="mt-auto inline-flex items-center justify-center gap-1 pt-4 text-[12px] font-medium text-muted-foreground hover:text-foreground"
      >
        Voir le planning complet
        <ArrowRight className="size-3" strokeWidth={2} />
      </Link>
    </div>
  )
}
