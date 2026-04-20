import Link from "next/link"

interface Customer {
  id: string
  name: string
  avatar: string
  roomNumber: string
  roomType: string
  checkIn: string
  checkOut: string
  paymentStatus: "paid" | "pending"
}

interface NewCustomersListProps {
  customers?: Customer[]
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2)
}

export function NewCustomersList({ customers }: NewCustomersListProps) {
  const defaultCustomers: Customer[] = [
    { id: "1", name: "Sara Jenkins", avatar: "", roomNumber: "Ch. 405", roomType: "Suite", checkIn: "18 mai", checkOut: "22 mai", paymentStatus: "paid" },
    { id: "2", name: "David Chen", avatar: "", roomNumber: "Ch. 102", roomType: "Double", checkIn: "19 mai", checkOut: "20 mai", paymentStatus: "pending" },
  ]

  const customerList = customers && customers.length > 0 ? customers : defaultCustomers

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Nouveaux clients
        </p>
        <Link
          href="/guests"
          className="text-[11.5px] text-muted-foreground hover:text-foreground"
        >
          Voir tout
        </Link>
      </div>

      <ul className="divide-y divide-border/60">
        {customerList.map((c) => (
          <li key={c.id} className="flex items-center justify-between py-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-foreground">
                {initials(c.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-foreground">
                  {c.name}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {c.roomNumber} · {c.roomType}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[11.5px] text-muted-foreground tabular-nums">
                {c.checkIn} → {c.checkOut}
              </span>
              <span
                className={`rounded-full border px-1.5 py-0.5 text-[9.5px] uppercase tracking-wide ${
                  c.paymentStatus === "paid"
                    ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "border-amber-500/30 text-amber-600 dark:text-amber-400"
                }`}
              >
                {c.paymentStatus === "paid" ? "Payé" : "En attente"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
