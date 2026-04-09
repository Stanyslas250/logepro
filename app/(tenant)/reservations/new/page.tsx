import Link from "next/link"
import { requireAuth } from "@/lib/auth/require-auth"
import { NewReservationForm } from "@/components/reservations/new-reservation-form"

export default async function NewReservationPage() {
  await requireAuth()

  return (
    <section>
      <header className="mb-10">
        <Link
          href="/reservations"
          className="flex items-center gap-2 text-primary font-medium text-sm mb-2 hover:underline"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          <span>Retour aux Réservations</span>
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight font-heading">
          Nouvelle Réservation
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Créez une réservation pour votre établissement.
        </p>
      </header>

      <NewReservationForm />
    </section>
  )
}
