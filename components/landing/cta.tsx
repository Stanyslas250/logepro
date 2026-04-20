import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, CheckCircleIcon } from "./icons"

export function Cta() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[40px] bg-linear-to-br from-primary via-chart-2 to-chart-3 p-10 text-primary-foreground shadow-2xl shadow-primary/30 md:p-16">
          {/* Decorative blobs */}
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-white/10 blur-3xl animate-aurora" />
          <div className="absolute -bottom-24 -left-20 size-96 rounded-full bg-chart-1/30 blur-3xl animate-aurora [animation-delay:-8s]" />
          {/* Grid overlay */}
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.08]" />

          <div className="relative grid items-center gap-10 md:grid-cols-5">
            <div className="md:col-span-3">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
                <span className="size-1.5 rounded-full bg-white animate-soft-pulse" />
                Offre de lancement
              </p>
              <h2 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
                Prêt à transformer{" "}
                <span className="italic">votre hôtel</span> ?
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-primary-foreground/90">
                Rejoignez les 120+ établissements qui redéfinissent
                l&apos;hospitalité en Afrique. Essai gratuit 14 jours, aucune
                carte requise.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  nativeButton={false}
                  render={<Link href="/onboarding/forfait" />}
                  className="h-12 gap-2 bg-background px-7 text-base text-foreground shadow-lg hover:bg-background/90"
                >
                  Démarrer gratuitement
                  <ArrowRightIcon className="size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/40 bg-white/10 px-7 text-base text-primary-foreground backdrop-blur hover:bg-white/20"
                >
                  Planifier une démo
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-primary-foreground/80">
                {[
                  "Essai 14 jours offert",
                  "Aucune carte requise",
                  "Résiliation en 1 clic",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircleIcon className="size-4" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Decorative stat card */}
            <div className="relative md:col-span-2">
              <div className="relative rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/80">
                  Résultat moyen
                </p>
                <p className="mt-2 font-heading text-5xl font-extrabold">
                  +24%
                </p>
                <p className="mt-1 text-sm text-primary-foreground/80">
                  Revenus sur 6 mois
                </p>
                <div className="mt-6 space-y-2">
                  {[
                    { k: "Temps gagné / jour", v: "2h15" },
                    { k: "Erreurs de caisse", v: "-89%" },
                    { k: "Satisfaction client", v: "4.8/5" },
                  ].map((s) => (
                    <div
                      key={s.k}
                      className="flex items-center justify-between border-t border-white/10 pt-2 text-sm"
                    >
                      <span className="text-primary-foreground/80">{s.k}</span>
                      <span className="font-bold">{s.v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -right-3 -top-3 rounded-xl bg-background px-3 py-2 text-xs font-bold text-foreground shadow-xl">
                <span className="text-(--success)">●</span> En direct
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
