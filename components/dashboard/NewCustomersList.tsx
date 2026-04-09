import Image from "next/image"

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

export function NewCustomersList({ customers }: NewCustomersListProps) {
  const defaultCustomers: Customer[] = [
    {
      id: "1",
      name: "Sara Jenkins",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
      roomNumber: "Chambre 405",
      roomType: "Suite",
      checkIn: "18 mai",
      checkOut: "22 mai",
      paymentStatus: "paid",
    },
    {
      id: "2",
      name: "David Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      roomNumber: "Chambre 102",
      roomType: "Double",
      checkIn: "19 mai",
      checkOut: "20 mai",
      paymentStatus: "pending",
    },
  ]

  const customerList = customers || defaultCustomers

  const getPaymentStatusStyle = (status: Customer["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "bg-primary/10 text-primary"
      case "pending":
        return "bg-amber-50 text-amber-600"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPaymentStatusText = (status: Customer["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "PAYÉ"
      case "pending":
        return "EN ATTENTE"
      default:
        return status
    }
  }

  return (
    <div className="bg-card rounded-xl p-6 space-y-4 border border-border shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Nouveaux clients
        </h3>
        <a href="#" className="text-xs font-bold text-primary hover:underline">
          Voir tout
        </a>
      </div>

      <div className="divide-y divide-border">
        {customerList.map((customer) => (
          <div key={customer.id} className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={customer.avatar}
                  alt={customer.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold">{customer.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {customer.roomNumber} • {customer.roomType}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold">
                {customer.checkIn} - {customer.checkOut}
              </p>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${getPaymentStatusStyle(
                  customer.paymentStatus
                )}`}
              >
                {getPaymentStatusText(customer.paymentStatus)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
