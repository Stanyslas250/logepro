import { createAdminClient } from "@/lib/supabase/admin"
import type { Organization, PlanType } from "@/types/database"

const PLAN_COLORS: Record<PlanType, { bg: string; text: string }> = {
  business: { bg: "bg-primary", text: "text-primary-foreground" },
  pro: { bg: "bg-emerald-600", text: "text-white" },
  starter: { bg: "bg-muted-foreground/30", text: "text-foreground" },
  trial: { bg: "bg-chart-1/20", text: "text-chart-1" },
}

const PLAN_LABELS: Record<PlanType, string> = {
  business: "BUSINESS",
  pro: "PRO",
  starter: "STARTER",
  trial: "TRIAL",
}

const STATUS_STYLES: Record<string, { dot: string; text: string; label: string }> = {
  active: { dot: "bg-emerald-500", text: "text-emerald-600", label: "Actif" },
  suspended: { dot: "bg-destructive animate-pulse", text: "text-destructive", label: "Suspendu" },
  archived: { dot: "bg-muted-foreground", text: "text-muted-foreground", label: "Archivé" },
}

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"]
const MOCK_REVENUE = [1100000, 1200000, 1150000, 1400000, 1600000, 1800000]
const MAX_REVENUE = Math.max(...MOCK_REVENUE)

export default async function AdminDashboardPage() {
  const supabase = createAdminClient()

  const [orgsResult, membershipsResult] = await Promise.all([
    supabase
      .schema("platform")
      .from("organizations")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<Organization[]>(),
    supabase
      .schema("platform")
      .from("memberships")
      .select("organization_id"),
  ])

  const orgs = orgsResult.data ?? []
  const memberships = membershipsResult.data ?? []

  const memberCountByOrg = memberships.reduce<Record<string, number>>(
    (acc, m) => {
      acc[m.organization_id] = (acc[m.organization_id] ?? 0) + 1
      return acc
    },
    {}
  )

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const activeOrgs = orgs.filter((o) => o.status === "active")
  const newThisMonth = orgs.filter(
    (o) => new Date(o.created_at) >= startOfMonth
  )
  const planCounts: Record<PlanType, number> = {
    trial: 0,
    starter: 0,
    pro: 0,
    business: 0,
  }
  for (const org of orgs) {
    planCounts[org.plan] = (planCounts[org.plan] ?? 0) + 1
  }

  const totalOrgs = orgs.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          Dashboard Global
        </h2>
        <p className="mt-1 text-muted-foreground">
          Métriques en temps réel de l&apos;ensemble du portefeuille hôtelier.
        </p>
      </section>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Hôtels Actifs"
          value={String(activeOrgs.length)}
          icon={
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
              <path d="M9 22v-4h6v4" />
              <path d="M8 6h.01" /><path d="M16 6h.01" />
              <path d="M8 10h.01" /><path d="M16 10h.01" />
              <path d="M8 14h.01" /><path d="M16 14h.01" />
            </svg>
          }
          sub={
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
              {totalOrgs > 0 ? Math.round((activeOrgs.length / totalOrgs) * 100) : 0}% actifs
            </span>
          }
        />
        <KpiCard
          label="Total Hôtels"
          value={String(totalOrgs)}
          icon={
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18" />
              <path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" />
              <path d="M9 9v.01" /><path d="M9 12v.01" /><path d="M9 15v.01" /><path d="M9 18v.01" />
            </svg>
          }
          sub={
            <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>
              Tous les forfaits
            </span>
          }
        />
        <KpiCard
          label="Nouveaux (ce mois)"
          value={String(newThisMonth.length)}
          icon={
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M19 8v6" /><path d="M22 11h-6" />
            </svg>
          }
          sub={
            <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>
              Ce mois-ci
            </span>
          }
        />
        <KpiCard
          label="Plans Business"
          value={String(planCounts.business)}
          icon={
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          }
          sub={
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
              Forfait premium
            </span>
          }
        />
      </div>

      {/* Revenue Trends + Plan Distribution */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm lg:col-span-2">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h3 className="font-heading text-xl font-bold">
                Tendances Revenus
              </h3>
              <p className="text-sm text-muted-foreground">
                Aperçu des performances sur les 6 derniers mois
              </p>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
                Mensuel
              </span>
              <span className="px-3 py-1 text-xs font-bold text-muted-foreground">
                Trimestriel
              </span>
            </div>
          </div>
          <div className="flex h-64 items-end justify-between gap-4">
            {MOCK_REVENUE.map((rev, i) => {
              const height = (rev / MAX_REVENUE) * 100
              const isLast = i === MOCK_REVENUE.length - 1
              return (
                <div
                  key={i}
                  className="group relative flex-1"
                  style={{ height: "100%" }}
                >
                  <div
                    className={`absolute bottom-0 w-full rounded-t-lg transition-colors ${
                      isLast
                        ? "bg-primary shadow-lg"
                        : "bg-primary/15 hover:bg-primary/30"
                    }`}
                    style={{ height: `${height}%` }}
                  >
                    <div
                      className={`absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-[10px] text-background transition-opacity ${
                        isLast ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {formatCurrency(rev)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex justify-between px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="flex flex-col rounded-xl border border-border bg-card p-8 shadow-sm">
          <h3 className="font-heading text-xl font-bold">
            Distribution Plans
          </h3>
          <p className="mb-8 text-sm text-muted-foreground">
            Segmentation par forfait hôtelier
          </p>
          <div className="flex flex-1 items-center justify-center">
            <DonutChart
              total={totalOrgs}
              segments={[
                { value: planCounts.business, color: "var(--primary)" },
                { value: planCounts.pro, color: "oklch(0.52 0.17 160)" },
                { value: planCounts.starter, color: "oklch(0.65 0.025 264)" },
                { value: planCounts.trial, color: "oklch(0.623 0.214 259.815)" },
              ]}
            />
          </div>
          <div className="mt-8 space-y-3">
            <PlanLegendRow label="Business" count={planCounts.business} color="bg-primary" />
            <PlanLegendRow label="Pro" count={planCounts.pro} color="bg-emerald-600" />
            <PlanLegendRow label="Starter" count={planCounts.starter} color="bg-muted-foreground" />
            <PlanLegendRow label="Trial" count={planCounts.trial} color="bg-chart-1" />
          </div>
        </div>
      </div>

      {/* Hotels Table + Recent Activity */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm xl:col-span-3">
          <div className="flex items-center justify-between border-b border-border p-6">
            <h3 className="font-heading text-xl font-bold">
              Hôtels Gérés
            </h3>
            <button className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
              Voir tout
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Nom de l&apos;Hôtel
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Plan
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Créé le
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Membres
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orgs.slice(0, 10).map((org) => {
                  const initials = org.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                  const plan = PLAN_COLORS[org.plan]
                  const status = STATUS_STYLES[org.status] ?? STATUS_STYLES.active

                  return (
                    <tr
                      key={org.id}
                      className="transition-colors hover:bg-secondary/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                            {initials}
                          </div>
                          <span className="text-sm font-bold">{org.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {org.slug}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${plan.bg} ${plan.text}`}
                        >
                          {PLAN_LABELS[org.plan]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-xs font-bold ${status.text}`}>
                          <span className={`size-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(org.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold">
                        {memberCountByOrg[org.id] ?? 0}
                      </td>
                    </tr>
                  )
                })}
                {orgs.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
                    >
                      Aucun hôtel enregistré pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-heading mb-6 text-xl font-bold">
            Onboarding Récent
          </h3>
          <div className="space-y-6">
            {orgs.slice(0, 5).map((org, i) => {
              const colors = [
                "bg-primary",
                "bg-emerald-500",
                "bg-chart-1",
                "bg-muted-foreground",
                "bg-destructive",
              ]
              return (
                <div key={org.id} className="flex items-start gap-4">
                  <div
                    className={`mt-2 size-2 shrink-0 rounded-full ${colors[i % colors.length]}`}
                  />
                  <div>
                    <p className="text-sm font-bold">Nouvel hôtel inscrit</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {org.name} a rejoint le plan{" "}
                      <span className="font-semibold capitalize">
                        {org.plan}
                      </span>
                      .
                    </p>
                    <span className="mt-2 block text-[10px] font-bold uppercase text-muted-foreground/60">
                      {formatRelativeDate(org.created_at)}
                    </span>
                  </div>
                </div>
              )
            })}
            {orgs.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucune activité récente.
              </p>
            )}
          </div>
          {orgs.length > 5 && (
            <button className="mt-8 w-full rounded-xl border border-border py-3 text-xs font-bold transition-colors hover:bg-secondary">
              Voir le journal complet
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Local components                                                          */
/* -------------------------------------------------------------------------- */

function KpiCard({
  label,
  value,
  icon,
  sub,
}: {
  label: string
  value: string
  icon: React.ReactNode
  sub: React.ReactNode
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <span className="text-primary">{icon}</span>
      </div>
      <div className="mt-4">
        <p className="font-heading text-3xl font-extrabold text-foreground">
          {value}
        </p>
        <div className="mt-2">{sub}</div>
      </div>
    </div>
  )
}

function PlanLegendRow({
  label,
  count,
  color,
}: {
  label: string
  count: number
  color: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`size-3 rounded-full ${color}`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm font-bold">{count}</span>
    </div>
  )
}

function DonutChart({
  total,
  segments,
}: {
  total: number
  segments: { value: number; color: string }[]
}) {
  if (total === 0) {
    return (
      <div className="flex size-48 items-center justify-center rounded-full border-20 border-muted">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-extrabold">0</span>
          <span className="text-[10px] font-bold uppercase text-muted-foreground">
            Hôtels
          </span>
        </div>
      </div>
    )
  }

  const nonZero = segments.filter((s) => s.value > 0)
  let cumulativePct = 0
  const stops: string[] = []

  for (const seg of nonZero) {
    const pct = (seg.value / total) * 100
    stops.push(`${seg.color} ${cumulativePct}% ${cumulativePct + pct}%`)
    cumulativePct += pct
  }

  if (cumulativePct < 100) {
    stops.push(`var(--muted) ${cumulativePct}% 100%`)
  }

  return (
    <div
      className="relative flex size-48 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(${stops.join(", ")})`,
      }}
    >
      <div className="flex size-28 flex-col items-center justify-center rounded-full bg-card">
        <span className="text-2xl font-extrabold">{total}</span>
        <span className="text-[10px] font-bold uppercase text-muted-foreground">
          Hôtels
        </span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M €`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K €`
  return `${value} €`
}

function formatRelativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return "À l'instant"
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days === 1) return "Hier"
  if (days < 30) return `Il y a ${days} jours`
  const months = Math.floor(days / 30)
  return `Il y a ${months} mois`
}
