"use client"

import { useState } from "react"
import Link from "next/link"
import { useOnboarding } from "@/components/onboarding/onboarding-context"
import { OnboardingShell } from "@/components/onboarding/shell"
import { SparkleIcon } from "@/components/landing/icons"
import { cn } from "@/lib/utils"

const planLabels = {
  starter: "Starter",
  pro: "Pro Edition",
  business: "Business",
} as const

const ROLE_LABELS: Record<string, string> = {
  manager: "Manager",
  receptionniste: "Réceptionniste",
  menage: "Ménage",
  comptable: "Comptable",
}

const ROLE_STYLES: Record<string, string> = {
  manager: "bg-violet-500/15 text-violet-600 border-violet-500/30",
  receptionniste: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  menage: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  comptable: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
}

const AVATAR_GRADIENTS = [
  "from-primary to-chart-2",
  "from-chart-1 to-primary",
  "from-chart-2 to-chart-1",
  "from-(--success) to-chart-1",
  "from-primary to-(--success)",
]

export default function RevisionPage() {
  const {
    plan,
    floors,
    roomsPerFloor,
    totalRooms,
    orgName,
    slug,
    setOrgName,
    invitations,
  } = useOnboarding()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingName, setEditingName] = useState(false)

  const canSubmit = orgName.trim().length >= 2 && slug.length >= 2

  async function handleProvision() {
    if (!canSubmit) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgName: orgName.trim(),
          slug,
          plan,
          floors,
          roomsPerFloor,
          invitations,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue")
        setLoading(false)
        return
      }

      window.location.href = data.tenantUrl + "/dashboard"
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.")
      setLoading(false)
    }
  }

  return (
    <OnboardingShell maxWidth="max-w-5xl">
      <div className="mb-6 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
            <SparkleIcon className="size-3" />
            Étape 5 · Révision
          </span>
          Dernière vérification avant lancement
        </span>
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
          Prêt pour{" "}
          <span className="relative inline-block">
            <span className="bg-linear-to-r from-primary via-chart-2 to-chart-1 bg-clip-text text-transparent">
              le décollage
            </span>
            <svg
              className="absolute -bottom-1.5 left-0 w-full text-primary/40"
              viewBox="0 0 300 12"
              fill="none"
              preserveAspectRatio="none"
            >
              <path d="M2 9 Q 75 2, 150 6 T 298 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
          Vérifiez votre configuration. Votre espace sera créé en quelques
          secondes.
        </p>
      </div>

      {/* KPI row */}
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Étages", value: floors },
          { label: "Chambres/ét.", value: roomsPerFloor },
          { label: "Capacité totale", value: totalRooms, accent: true },
          { label: "Équipe", value: invitations.length },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-border/40 bg-card/70 p-4 shadow-xl shadow-primary/5 backdrop-blur-xl"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {k.label}
            </p>
            <p
              className={cn(
                "font-heading mt-1 text-2xl font-extrabold tracking-tight",
                k.accent
                  ? "bg-linear-to-r from-primary via-chart-2 to-chart-1 bg-clip-text text-transparent"
                  : "text-foreground"
              )}
            >
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main recap grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Establishment */}
        <div className="rounded-2xl border border-border/40 bg-card/70 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Établissement
            </h3>
            <button
              onClick={() => setEditingName(!editingName)}
              className="text-xs font-bold text-primary hover:underline"
            >
              {editingName ? "Terminé" : "Modifier"}
            </button>
          </div>

          {editingName ? (
            <div className="space-y-3">
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Ex : Hôtel Le Marlin"
                className="h-11 w-full rounded-lg border border-border/60 bg-background/70 px-4 text-base outline-none backdrop-blur transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
              {slug && (
                <p className="text-sm text-muted-foreground">
                  Sous-domaine :{" "}
                  <span className="font-mono font-semibold text-primary">
                    {slug}.logepro.app
                  </span>
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-chart-2 font-heading text-xl font-black text-primary-foreground shadow-lg shadow-primary/30">
                {orgName ? orgName.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="min-w-0">
                <p className="truncate font-heading text-xl font-bold">
                  {orgName || (
                    <span className="text-muted-foreground">Nom non défini</span>
                  )}
                </p>
                <p className="truncate font-mono text-sm text-muted-foreground">
                  {slug ? `${slug}.logepro.app` : "—"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Plan */}
        <div className="rounded-2xl border border-border/40 bg-card/70 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Forfait
            </h3>
            <Link
              href="/onboarding/forfait"
              className="text-xs font-bold text-primary hover:underline"
            >
              Modifier
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-chart-1/20 to-chart-2/20 text-chart-1">
              <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </div>
            <div>
              <p className="font-heading text-xl font-bold bg-linear-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                {planLabels[plan]}
              </p>
              <p className="text-sm text-muted-foreground">
                Facturation mensuelle
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="mt-5 rounded-2xl border border-border/40 bg-card/70 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Équipe{" "}
            {invitations.length > 0 && (
              <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                {invitations.length}
              </span>
            )}
          </h3>
          <Link
            href="/onboarding/acces"
            className="text-xs font-bold text-primary hover:underline"
          >
            Modifier
          </Link>
        </div>
        {invitations.length > 0 ? (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {invitations.map((inv, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/40 p-3"
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-xs font-bold text-primary-foreground shadow-sm",
                    AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
                  )}
                >
                  {inv.email.charAt(0).toUpperCase()}
                </div>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {inv.email}
                </span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                    ROLE_STYLES[inv.role] ?? "bg-muted text-muted-foreground border-border"
                  )}
                >
                  {ROLE_LABELS[inv.role] ?? inv.role}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucune invitation prévue. Vous pourrez inviter des collaborateurs
            depuis votre tableau de bord.
          </p>
        )}
      </div>

      {/* Launch info */}
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-chart-2/20 text-primary">
          <SparkleIcon className="size-4" />
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Votre espace sera accessible sur{" "}
          <span className="font-mono font-semibold text-primary">
            {slug || "..."}.logepro.app
          </span>{" "}
          avec <span className="font-semibold text-foreground">{totalRooms} chambres</span>{" "}
          pré-configurées, prêtes à recevoir vos premières réservations.
        </p>
      </div>

      {error && (
        <div className="mt-5 rounded-xl bg-destructive/10 px-5 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Sticky launch bar */}
      <div className="sticky bottom-4 mt-8 flex items-center justify-between rounded-2xl border border-border/40 bg-card/80 p-4 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <Link
          href="/onboarding/acces"
          className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg className="size-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
          Retour
        </Link>
        <button
          onClick={handleProvision}
          disabled={!canSubmit || loading}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-primary via-chart-2 to-chart-1 px-7 py-3 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/30 transition-all",
            canSubmit && !loading
              ? "hover:-translate-y-0.5 active:scale-[0.98]"
              : "cursor-not-allowed opacity-50"
          )}
        >
          {loading ? (
            <>
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
              </svg>
              Création en cours…
            </>
          ) : (
            <>
              <SparkleIcon className="size-4" />
              Créer mon établissement
            </>
          )}
        </button>
      </div>
    </OnboardingShell>
  )
}
