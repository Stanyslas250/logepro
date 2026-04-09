import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Starter",
    price: "25 000",
    target: "Apparts, motels (≤ 10 chambres)",
    popular: false,
    features: [
      "Gestion des réservations",
      "Caisse et facturation",
      "Tableau de bord simplifié",
    ],
  },
  {
    name: "Pro",
    price: "55 000",
    target: "Hôtels locaux (10–50 chambres)",
    popular: true,
    features: [
      "Tout le plan Starter",
      "Gestion des stocks",
      "Gestion RH et personnel",
      "Rapports et analyses avancés",
    ],
  },
  {
    name: "Business",
    price: "100 000",
    target: "Hôtels 50+ chambres, multi-sites",
    popular: false,
    features: [
      "Tout le plan Pro",
      "Gestion multi-sites",
      "Accès API",
      "Support prioritaire dédié",
    ],
  },
]

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-(--success)"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

export function Pricing() {
  return (
    <section id="tarifs" className="bg-muted/50 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 text-center">
          <h2 className="mb-6 font-heading text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Des tarifs adaptés à{" "}
            <span className="italic text-primary">votre établissement</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Choisissez le plan qui correspond à la taille et aux besoins de
            votre hôtel. Sans engagement, évolutif à tout moment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative overflow-hidden rounded-3xl bg-card p-10 transition-all hover:shadow-2xl",
                plan.popular
                  ? "border-2 border-primary shadow-xl"
                  : "border border-border/20"
              )}
            >
              {plan.popular && (
                <div className="absolute right-6 top-6 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
                  Populaire
                </div>
              )}

              <div className="mb-8">
                <h3 className="mb-2 font-heading text-2xl font-bold tracking-tight">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground">{plan.target}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-extrabold text-foreground">
                  {plan.price}
                </span>
                <span className="ml-1 text-lg text-muted-foreground">FCFA</span>
                <span className="text-sm text-muted-foreground">/mois</span>
              </div>

              <ul className="mb-10 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckIcon />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "default" : "secondary"}
                className="w-full py-5"
              >
                Choisir {plan.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
