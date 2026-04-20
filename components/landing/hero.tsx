import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, PlayIcon, SparkleIcon, StarIcon } from "./icons"

export function Hero() {
  return (
    <section
      id="plateforme"
      className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28"
    >
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern mask-radial-faded opacity-60" />
        <div className="absolute left-1/2 top-[-10%] size-[720px] -translate-x-1/2 rounded-full bg-linear-to-br from-primary/30 via-chart-2/20 to-transparent blur-3xl animate-aurora" />
        <div className="absolute right-[-10%] top-[30%] size-[520px] rounded-full bg-linear-to-tr from-chart-1/25 to-transparent blur-3xl animate-aurora [animation-delay:-6s]" />
        <div className="absolute left-[-15%] bottom-[-10%] size-[480px] rounded-full bg-linear-to-tr from-(--success)/20 to-transparent blur-3xl animate-aurora [animation-delay:-12s]" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* Announcement */}
        <div className="mb-8 flex justify-center">
          <a
            href="#fonctionnalites"
            className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-md transition-colors hover:text-foreground"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
              <SparkleIcon className="size-3" />
              Nouveau
            </span>
            Votre assistant dans la gestion de votre structure
            <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-7xl">
            La plateforme qui transforme{" "}
            <span className="relative inline-block">
              <span className="bg-linear-to-r from-primary via-chart-2 to-chart-1 bg-clip-text text-transparent">
                votre hôtel
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full text-primary/40"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9 Q 75 2, 150 6 T 298 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <br />
            en machine bien huilée.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Réservations, caisse, personnel, stocks — tout dans une interface
            pensée pour les hôteliers africains. Moins de friction, plus de
            clients satisfaits.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/onboarding/forfait" />}
              className="h-12 gap-2 px-7 text-base shadow-xl shadow-primary/30 transition-transform hover:-translate-y-0.5"
            >
              Démarrer gratuitement
              <ArrowRightIcon className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 gap-2 border-border/60 bg-card/60 px-6 text-base backdrop-blur"
            >
              <PlayIcon className="size-3.5 text-primary" />
              Voir la démo (2 min)
            </Button>
          </div>

          {/* Trust row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="size-3.5 text-amber-500" />
                ))}
              </div>
              <span className="font-medium text-foreground">4.9/5</span>
              <span>· 120+ hôteliers</span>
            </div>
            <div className="hidden h-3 w-px bg-border md:block" />
            <div className="flex items-center gap-1.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--success) opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-(--success)" />
              </span>
              Configuration en moins de 10 minutes
            </div>
            <div className="hidden h-3 w-px bg-border md:block" />
            <span>Sans engagement · Support FR 24/7</span>
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="relative mx-auto mt-16 max-w-5xl md:mt-20">
          <div className="absolute -inset-x-20 -inset-y-10 -z-10 rounded-[48px] bg-linear-to-b from-primary/10 to-transparent blur-2xl" />
          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}

function DashboardMockup() {
  return (
    <div className="group gradient-border relative overflow-hidden rounded-2xl border border-border/40 bg-card shadow-2xl shadow-primary/10">
      {/* Window bar */}
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-green-400/70" />
        </div>
        <div className="hidden rounded-md bg-background/60 px-3 py-1 text-xs text-muted-foreground sm:block">
          app.logepro.com · tableau de bord
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-(--success)" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            en direct
          </span>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="grid grid-cols-12 gap-3 bg-linear-to-br from-background to-muted/30 p-4 sm:p-6">
        {/* Sidebar */}
        <div className="col-span-2 hidden flex-col gap-1.5 rounded-xl border border-border/40 bg-card/60 p-2 md:flex">
          {[
            { label: "Accueil", active: true },
            { label: "Réservations" },
            { label: "Chambres" },
            { label: "Clients" },
            { label: "Caisse" },
            { label: "Stocks" },
            { label: "Équipe" },
            { label: "Rapports" },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-medium ${
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  item.active ? "bg-primary" : "bg-muted-foreground/40"
                }`}
              />
              {item.label}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="col-span-12 space-y-3 md:col-span-10">
          {/* KPI row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Occupation", value: "92%", delta: "+8%", trend: "up" },
              { label: "Revenu jour", value: "1.84M", delta: "+12%", trend: "up" },
              { label: "Arrivées", value: "14", delta: "6 en att.", trend: "neutral" },
              { label: "ADR", value: "48k", delta: "+3%", trend: "up" },
            ].map((k) => (
              <div
                key={k.label}
                className="rounded-xl border border-border/40 bg-card/80 p-3 shadow-sm"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {k.label}
                </p>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-lg font-extrabold text-foreground">
                    {k.value}
                  </span>
                  <span
                    className={`text-[10px] font-semibold ${
                      k.trend === "up"
                        ? "text-(--success)"
                        : "text-muted-foreground"
                    }`}
                  >
                    {k.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart + side list */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 rounded-xl border border-border/40 bg-card/80 p-4 lg:col-span-8">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Revenus sur 30 jours
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Comparé à la période précédente
                  </p>
                </div>
                <div className="flex gap-1">
                  {["7J", "30J", "90J"].map((t, i) => (
                    <span
                      key={t}
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                        i === 1
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <MiniChart />
            </div>

            <div className="col-span-12 rounded-xl border border-border/40 bg-card/80 p-4 lg:col-span-4">
              <p className="mb-3 text-xs font-semibold text-foreground">
                Arrivées du jour
              </p>
              <div className="space-y-2.5">
                {[
                  { n: "AD", name: "A. Diallo", room: "204", status: "Confirmé" },
                  { n: "FK", name: "F. Koné", room: "118", status: "En route" },
                  { n: "MY", name: "M. Yao", room: "312", status: "Arrivé" },
                  { n: "SB", name: "S. Bamba", room: "407", status: "Confirmé" },
                ].map((g) => (
                  <div key={g.name} className="flex items-center gap-2.5">
                    <div className="flex size-7 items-center justify-center rounded-full bg-linear-to-br from-primary/80 to-chart-2/80 text-[10px] font-bold text-primary-foreground">
                      {g.n}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-foreground">
                        {g.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Chambre {g.room}
                      </p>
                    </div>
                    <span className="rounded bg-(--success)/15 px-1.5 py-0.5 text-[9px] font-semibold text-(--success)">
                      {g.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating card: occupation */}
      <div className="absolute -left-4 bottom-16 hidden w-56 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-2xl backdrop-blur-xl md:block">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-(--success)/15 text-(--success)">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Cette semaine
            </p>
            <p className="text-xl font-extrabold text-foreground">+24,8%</p>
          </div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[78%] rounded-full bg-linear-to-r from-(--success) to-chart-1" />
        </div>
      </div>

      {/* Floating card: notif */}
      <div className="absolute -right-4 top-24 hidden w-60 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-2xl backdrop-blur-xl md:block">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <SparkleIcon className="size-4" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-foreground">
              Suggestion IA
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
              Augmentez le prix des suites de <b>+8%</b> pour le week-end.
              Demande en hausse détectée.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniChart() {
  // Smooth-ish area chart
  const points = [22, 28, 24, 34, 30, 42, 38, 48, 45, 56, 60, 54, 68, 72, 66, 78, 82, 88]
  const w = 600
  const h = 140
  const max = Math.max(...points)
  const step = w / (points.length - 1)
  const coords = points.map((p, i) => [i * step, h - (p / max) * (h - 10) - 5] as const)
  const linePath = coords
    .map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`))
    .join(" ")
  const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-32 w-full">
      <defs>
        <linearGradient id="heroChartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="heroChartStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--chart-1)" />
        </linearGradient>
      </defs>
      {/* grid */}
      {[0.25, 0.5, 0.75].map((r) => (
        <line
          key={r}
          x1={0}
          x2={w}
          y1={h * r}
          y2={h * r}
          stroke="currentColor"
          className="text-border"
          strokeDasharray="2 4"
          opacity={0.5}
        />
      ))}
      <path d={areaPath} fill="url(#heroChartFill)" />
      <path
        d={linePath}
        fill="none"
        stroke="url(#heroChartStroke)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* end dot */}
      <circle
        cx={coords[coords.length - 1][0]}
        cy={coords[coords.length - 1][1]}
        r={4}
        fill="var(--primary)"
      />
      <circle
        cx={coords[coords.length - 1][0]}
        cy={coords[coords.length - 1][1]}
        r={8}
        fill="var(--primary)"
        opacity={0.2}
      />
    </svg>
  )
}
