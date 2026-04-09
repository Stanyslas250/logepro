import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-background pt-20">
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Le nouveau standard hôtelier
          </div>

          <h1 className="font-heading text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-7xl">
            Élevez l&apos;hospitalité avec une{" "}
            <span className="bg-linear-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Efficacité Invisible
            </span>
          </h1>

          <p className="max-w-lg text-xl leading-relaxed text-muted-foreground">
            LogePro est la plateforme de gestion hôtelière la plus intuitive,
            conçue pour les établissements qui privilégient l&apos;expérience
            client plutôt que les contraintes opérationnelles.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" className="gap-2 px-8 py-6 text-base shadow-xl shadow-primary/30">
              Demander une démo
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="px-8 py-6 text-base"
            >
              Voir la vitrine
            </Button>
          </div>
        </div>

        <div className="relative flex items-center lg:h-[600px]">
          <div className="relative aspect-square h-full w-full overflow-hidden rounded-3xl shadow-2xl md:aspect-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-full w-full object-cover"
              alt="Hall d'un hôtel de luxe avec éclairage ambiant"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnb30Kia3gdaZzaW-2HQWQaqPzGuMkMOXEyvXhoKOvqEaQeM8E2Rv16JMF2axFnkt0ppcqcdY3pfG0lPUax8H_ux95hWpO0CdhzUhQbWaG_vocGTqHdAg2oPDXPt0jmlRYIlqu8zAMdvb7YnfvsWYRK0bsrEvW5bC1o-k1sIU6vSFqnu4B82iUlWQHKA3D2YZ8K49s3EmjqxeaYMVx-sLEAtWmMb1wnjA1G2C6mCYQYaZUrc-DuS_ZGTWhdKMz1zm1LpwUeUL9rq0"
            />
            <div className="absolute inset-0 bg-linear-to-t from-primary/40 to-transparent" />
          </div>

          <div className="absolute -bottom-6 -left-6 max-w-[280px] rounded-2xl border border-border/20 bg-card/90 p-6 shadow-2xl backdrop-blur-xl md:-left-12">
            <div className="mb-4 flex items-center gap-4">
              <div className="rounded-lg bg-(--success) p-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Occupation
                </p>
                <p className="text-2xl font-extrabold text-foreground">98,4%</p>
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[98%] bg-(--success)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
