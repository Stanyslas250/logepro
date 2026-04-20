import {
  BoltIcon,
  CalendarIcon,
  ChartIcon,
  GlobeIcon,
  LayoutIcon,
  ShieldIcon,
  SparkleIcon,
  UsersIcon,
} from "./icons"

export function Features() {
  return (
    <section id="fonctionnalites" className="relative bg-background py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
            <SparkleIcon className="size-3 text-primary" />
            Tout en un
          </div>
          <h2 className="font-heading text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Un écosystème pensé pour{" "}
            <span className="bg-linear-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              les hôteliers modernes
            </span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Chaque fonctionnalité a été conçue avec des directeurs d&apos;hôtels.
            Pas de surcharge, pas de bloatware — juste ce qui fait avancer votre
            business.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
          {/* Tableau de bord - large */}
          <FeatureCard
            className="md:col-span-4"
            icon={<LayoutIcon className="size-5" />}
            title="Tableau de bord unifié"
            description="Chaque interaction, demande et indicateur dans une vue unique. Prenez des décisions en quelques secondes."
          >
            <DashboardPreview />
          </FeatureCard>

          {/* Calendrier */}
          <FeatureCard
            className="md:col-span-2"
            icon={<CalendarIcon className="size-5" />}
            title="Planning visuel"
            description="Drag & drop, code couleur, conflits détectés automatiquement."
          >
            <CalendarPreview />
          </FeatureCard>

          {/* Analyses */}
          <FeatureCard
            className="md:col-span-3"
            icon={<ChartIcon className="size-5" />}
            title="Analyses prédictives"
            description="L'IA détecte les tendances d'occupation et recommande vos prix."
          >
            <ChartPreview />
          </FeatureCard>

          {/* Sécurité */}
          <FeatureCard
            className="md:col-span-3"
            icon={<ShieldIcon className="size-5" />}
            title="Sécurité bancaire"
            description="Données chiffrées, sauvegardes quotidiennes, conformité RGPD/LIDP."
          >
            <SecurityPreview />
          </FeatureCard>

          {/* Performance */}
          <FeatureCard
            className="md:col-span-2"
            icon={<BoltIcon className="size-5" />}
            title="Ultra rapide"
            description="Interface <100ms même hors ligne."
            compact
          />

          {/* Multi-sites */}
          <FeatureCard
            className="md:col-span-2"
            icon={<GlobeIcon className="size-5" />}
            title="Multi-établissements"
            description="Pilotez plusieurs sites depuis un compte unique."
            compact
          />

          {/* RH */}
          <FeatureCard
            className="md:col-span-2"
            icon={<UsersIcon className="size-5" />}
            title="Équipes & rôles"
            description="Permissions fines, suivi des shifts, pointage digital."
            compact
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  children,
  className = "",
  compact = false,
}: {
  icon: React.ReactNode
  title: string
  description: string
  children?: React.ReactNode
  className?: string
  compact?: boolean
}) {
  return (
    <div
      className={`group gradient-border relative overflow-hidden rounded-3xl border border-border/40 bg-card/60 transition-all hover:shadow-xl hover:shadow-primary/5 ${className}`}
    >
      {/* Sheen */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="animate-sheen absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/5 to-transparent" />
      </div>

      <div className={`relative ${compact ? "p-6" : "p-7"}`}>
        <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10">
          {icon}
        </div>
        <h3
          className={`font-heading font-bold tracking-tight text-foreground ${
            compact ? "text-lg" : "text-xl"
          }`}
        >
          {title}
        </h3>
        <p
          className={`mt-2 leading-relaxed text-muted-foreground ${
            compact ? "text-sm" : "text-[15px]"
          }`}
        >
          {description}
        </p>
      </div>
      {children && <div className="relative px-7 pb-7">{children}</div>}
    </div>
  )
}

function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/40 bg-background shadow-inner">
      <div className="grid grid-cols-3 gap-2 p-3">
        {[
          { label: "Occupation", value: "92%", color: "var(--primary)" },
          { label: "Revenus", value: "1.84M", color: "var(--success)" },
          { label: "ADR", value: "48k", color: "var(--chart-1)" },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-lg border border-border/40 bg-card p-2.5"
          >
            <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              {k.label}
            </p>
            <p className="mt-0.5 text-sm font-extrabold text-foreground">
              {k.value}
            </p>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{ width: "78%", background: k.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border/40 px-3 py-2">
        <MiniBars />
      </div>
    </div>
  )
}

function MiniBars() {
  const bars = [30, 45, 38, 52, 48, 62, 58, 70, 66, 78, 72, 85]
  return (
    <svg viewBox="0 0 240 40" className="h-10 w-full">
      {bars.map((b, i) => (
        <rect
          key={i}
          x={i * 20 + 2}
          y={40 - b * 0.4}
          width={14}
          height={b * 0.4}
          rx={2}
          fill="url(#barGrad)"
        />
      ))}
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function CalendarPreview() {
  const days = Array.from({ length: 21 }, (_, i) => i)
  const states = ["free", "booked", "booked", "free", "blocked", "booked", "free"]
  return (
    <div className="overflow-hidden rounded-xl border border-border/40 bg-background p-3">
      <div className="mb-2 flex items-center justify-between text-[10px] font-semibold">
        <span className="text-foreground">Septembre</span>
        <span className="text-muted-foreground">Sem. 38</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const state = states[d % states.length]
          return (
            <div
              key={d}
              className={`aspect-square rounded-md text-center text-[9px] font-semibold leading-[1.7rem] ${
                state === "booked"
                  ? "bg-primary text-primary-foreground"
                  : state === "blocked"
                    ? "bg-muted text-muted-foreground line-through"
                    : "bg-card text-foreground border border-border/40"
              }`}
            >
              {d + 1}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChartPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/40 bg-background p-4">
      <svg viewBox="0 0 300 100" className="h-24 w-full">
        <defs>
          <linearGradient id="featChart" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 70 C 40 60, 60 40, 100 45 S 160 70, 200 35 S 260 15, 300 25 L 300 100 L 0 100 Z"
          fill="url(#featChart)"
        />
        <path
          d="M0 70 C 40 60, 60 40, 100 45 S 160 70, 200 35 S 260 15, 300 25"
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M0 80 C 40 75, 60 65, 100 68 S 160 82, 200 60 S 260 50, 300 55"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
          opacity="0.7"
        />
      </svg>
      <div className="mt-2 flex items-center gap-4 text-[10px]">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="size-2 rounded-full bg-chart-1" />
          Réel
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="size-2 rounded-full bg-primary opacity-70" />
          Prévision IA
        </span>
      </div>
    </div>
  )
}

function SecurityPreview() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-background p-4">
      <div className="flex size-12 items-center justify-center rounded-full bg-(--success)/15 text-(--success) ring-4 ring-(--success)/10">
        <ShieldIcon className="size-6" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground">
            Chiffrement AES-256
          </p>
          <span className="rounded-full bg-(--success)/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-(--success)">
            Actif
          </span>
        </div>
        <div className="mt-2 space-y-1">
          {["RGPD & LIDP", "Backups toutes les 6h", "Audit trail complet"].map(
            (t) => (
              <div
                key={t}
                className="flex items-center gap-1.5 text-[10px] text-muted-foreground"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-(--success)"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {t}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
