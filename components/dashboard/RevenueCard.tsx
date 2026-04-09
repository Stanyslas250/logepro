import { HugeiconsIcon } from "@hugeicons/react"
import { CreditCardIcon } from "@hugeicons/core-free-icons"

interface RevenueCardProps {
  last30Days: number
  yesterday: number
}

export function RevenueCard({ last30Days, yesterday }: RevenueCardProps) {
  return (
    <div className="bg-primary text-primary-foreground p-6 rounded-xl relative overflow-hidden flex flex-col justify-between border border-border shadow-sm">
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-foreground/10 rounded-full blur-3xl" />
      <div className="relative z-10 flex justify-between items-start">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary-foreground/80">
          Revenus
        </h3>
        <HugeiconsIcon icon={CreditCardIcon} size={20} className="text-primary-foreground/60" />
      </div>
      <div className="relative z-10">
        <p className="text-xs text-primary-foreground/80 uppercase font-bold tracking-widest">
          Derniers 30 jours
        </p>
        <p className="text-4xl font-extrabold tracking-tight mt-1">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(last30Days)}
        </p>
      </div>
      <div className="relative z-10 pt-4 border-t border-primary-foreground/10 flex justify-between items-center">
        <span className="text-xs text-primary-foreground/80">Hier</span>
        <span className="font-bold">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(yesterday)}
        </span>
      </div>
    </div>
  )
}
