
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
    {
      id: "1",
      guestName: "Jean Dupont",
      roomType: "Deluxe King",
      roomNumber: "Chambre 302",
      date: 20,
      day: "Lun",
      status: "arrival",
    },
    {
      id: "2",
      guestName: "Marie Laurent",
      roomType: "Suite Simple",
      roomNumber: "Chambre 104",
      date: 21,
      day: "Mar",
      status: "departure",
    },
    {
      id: "3",
      guestName: "",
      roomType: "",
      roomNumber: "",
      date: 22,
      day: "Mer",
      status: "none",
    },
  ]

  const bookingEvents = events || defaultEvents

  const getStatusColor = (status: BookingEvent["status"]) => {
    switch (status) {
      case "arrival":
        return "bg-blue-50 border-l-4 border-primary"
      case "departure":
        return "bg-emerald-50 border-l-4 border-emerald-600"
      default:
        return ""
    }
  }

  const getTextColor = (status: BookingEvent["status"]) => {
    switch (status) {
      case "arrival":
        return "text-primary"
      case "departure":
        return "text-emerald-600"
      default:
        return ""
    }
  }

  return (
    <div className="bg-card rounded-xl p-6 space-y-6 border border-border shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Calendrier
        </h3>
        <span className="text-xs font-bold text-primary">
          {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
        </span>
      </div>

      <div className="space-y-4">
        {bookingEvents.map((event) => (
          <div key={event.id} className="flex items-start gap-4">
            <div className="flex flex-col items-center min-w-[40px]">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                {event.day}
              </span>
              <span
                className={`text-lg font-extrabold ${
                  event.status === "none" ? "text-muted-foreground/30" : ""
                }`}
              >
                {event.date}
              </span>
            </div>
            <div className="flex-1 space-y-2">
              {event.status === "none" ? (
                <div className="flex items-center h-12 border-b border-dashed border-border">
                  <span className="text-[10px] italic text-muted-foreground">
                    Aucune arrivée prévue
                  </span>
                </div>
              ) : (
                <div className={`p-3 rounded-lg ${getStatusColor(event.status)}`}>
                  <p className={`text-xs font-bold ${getTextColor(event.status)}`}>
                    {event.guestName}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {event.roomType} • {event.roomNumber}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-2 text-xs font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
        Voir le planning complet
      </button>
    </div>
  )
}
