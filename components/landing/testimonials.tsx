import { QuoteIcon, StarIcon } from "./icons"

const testimonials = [
  {
    quote:
      "LogePro n'a pas remplacé notre logiciel : il a recentré mon équipe sur les clients. Notre taux d'occupation a gagné 14 points en 6 mois.",
    name: "Amadou Diallo",
    role: "Directeur Général",
    company: "Azur Résidence, Abidjan",
    initials: "AD",
    featured: true,
  },
  {
    quote:
      "La caisse et la gestion des stocks dans un seul outil, c'est exactement ce qui me manquait. Je gagne 2h par jour.",
    name: "Mariame Koné",
    role: "Gérante",
    company: "Palm Royale",
    initials: "MK",
  },
  {
    quote:
      "L'équipe de support répond en français, comprend nos réalités. Le setup a pris une matinée.",
    name: "Yves Bamba",
    role: "Propriétaire",
    company: "Lagune Palace",
    initials: "YB",
  },
  {
    quote:
      "Le module multi-sites change tout. Piloter nos 3 établissements depuis Paris est devenu simple.",
    name: "Fatou N'Diaye",
    role: "COO",
    company: "Teranga Group",
    initials: "FN",
  },
  {
    quote:
      "Les rapports automatiques ont remplacé 4 fichiers Excel. Mes investisseurs adorent.",
    name: "Serge Adjé",
    role: "CFO",
    company: "Baobab Resort",
    initials: "SA",
  },
]

export function Testimonials() {
  const [featured, ...rest] = testimonials

  return (
    <section
      id="temoignages"
      className="relative bg-muted/30 py-28 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute left-1/4 top-0 size-[400px] rounded-full bg-chart-2/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 size-[400px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
            Témoignages
          </div>
          <h2 className="font-heading text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Ils pilotent leur hôtel{" "}
            <span className="italic text-primary">sans stress.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
          {/* Featured */}
          <div className="md:col-span-6 lg:col-span-3">
            <TestimonialCard item={featured} large />
          </div>

          {/* Smaller */}
          <div className="grid gap-5 md:col-span-6 md:grid-cols-2 lg:col-span-3">
            {rest.slice(0, 4).map((t) => (
              <TestimonialCard key={t.name} item={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({
  item,
  large = false,
}: {
  item: (typeof testimonials)[number]
  large?: boolean
}) {
  return (
    <div
      className={`gradient-border relative h-full overflow-hidden rounded-3xl border border-border/40 bg-card p-7 transition-all hover:shadow-lg ${
        large ? "md:p-10" : ""
      }`}
    >
      <QuoteIcon
        className={`absolute right-5 top-5 text-primary/15 ${
          large ? "size-16" : "size-10"
        }`}
      />
      <div className="flex items-center gap-1 text-amber-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className="size-3.5" />
        ))}
      </div>
      <p
        className={`mt-4 font-medium leading-relaxed text-foreground ${
          large ? "text-2xl md:text-3xl" : "text-base"
        }`}
      >
        «&nbsp;{item.quote}&nbsp;»
      </p>
      <div className="mt-6 flex items-center gap-3">
        <div
          className={`flex items-center justify-center rounded-full bg-linear-to-br from-primary to-chart-2 font-bold text-primary-foreground ${
            large ? "size-12 text-base" : "size-10 text-sm"
          }`}
        >
          {item.initials}
        </div>
        <div>
          <p className="font-semibold text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">
            {item.role} · {item.company}
          </p>
        </div>
      </div>
    </div>
  )
}
