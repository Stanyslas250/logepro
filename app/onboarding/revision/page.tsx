"use client"

import { useState } from "react"
import Link from "next/link"
import { useOnboarding } from "@/components/onboarding/onboarding-context"
import { Stepper } from "@/components/onboarding/stepper"
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
  manager: "bg-violet-500/10 text-violet-700 border-violet-500/20",
  receptionniste: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  menage: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  comptable: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
}

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
    <div className="flex flex-1 flex-col p-10">
      <header className="mx-auto mb-12 w-full max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight">
              Révision
            </h1>
            <p className="mt-2 text-muted-foreground">
              Vérifiez vos choix avant de finaliser la configuration.
            </p>
          </div>
          <Stepper currentStep={5} totalSteps={5} />
        </div>
      </header>

      <section className="mx-auto w-full max-w-5xl flex-1 space-y-6">
        {/* Organization Name + Subdomain */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold">Établissement</h3>
            <button
              onClick={() => setEditingName(!editingName)}
              className="text-xs font-medium text-primary hover:underline"
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
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                autoFocus
              />
              {slug && (
                <p className="text-sm text-muted-foreground">
                  Sous-domaine :{" "}
                  <span className="font-mono font-medium text-primary">
                    {slug}.logepro.app
                  </span>
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 font-heading text-lg font-bold text-primary">
                {orgName ? orgName.charAt(0).toUpperCase() : "?"}
              </div>
              <div>
                <p className="text-lg font-bold">
                  {orgName || (
                    <span className="text-muted-foreground">
                      Nom non défini
                    </span>
                  )}
                </p>
                <p className="font-mono text-sm text-muted-foreground">
                  {slug ? `${slug}.logepro.app` : "—"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Plan Summary */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold">Forfait</h3>
            <Link
              href="/onboarding/forfait"
              className="text-xs font-medium text-primary hover:underline"
            >
              Modifier
            </Link>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-primary">
                {planLabels[plan]}
              </p>
              <p className="text-sm text-muted-foreground">
                Facturation mensuelle
              </p>
            </div>
          </div>
        </div>

        {/* Structure Summary */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold">Structure</h3>
            <Link
              href="/onboarding/structure"
              className="text-xs font-medium text-primary hover:underline"
            >
              Modifier
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-6">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="font-heading text-3xl font-bold text-primary">
                {floors}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Étages</p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="font-heading text-3xl font-bold text-primary">
                {roomsPerFloor}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Chambres / étage
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="font-heading text-3xl font-bold text-primary">
                {totalRooms}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Capacité totale
              </p>
            </div>
          </div>
        </div>

        {/* Team Summary */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold">Équipe</h3>
            <Link
              href="/onboarding/acces"
              className="text-xs font-medium text-primary hover:underline"
            >
              Modifier
            </Link>
          </div>
          {invitations.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {invitations.map((inv, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted font-heading text-xs font-bold text-muted-foreground">
                    {inv.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="flex-1 text-sm font-medium">{inv.email}</span>
                  <span className={cn(
                    "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                    ROLE_STYLES[inv.role] ?? "bg-muted text-muted-foreground"
                  )}>
                    {ROLE_LABELS[inv.role] ?? inv.role}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Aucune invitation prévue. Vous pourrez inviter des collaborateurs
              depuis votre tableau de bord.
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-xl bg-destructive/10 px-6 py-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Info */}
        <div className="flex items-center gap-4 rounded-xl bg-primary/5 p-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <p className="text-sm leading-snug text-muted-foreground">
            Votre espace sera accessible sur{" "}
            <span className="font-mono font-medium text-primary">
              {slug || "..."}.logepro.app
            </span>{" "}
            avec {totalRooms} chambres pré-configurées.
          </p>
        </div>
      </section>

      <footer className="mx-auto mt-auto flex w-full max-w-5xl items-center justify-between border-t border-border py-10">
        <Link
          href="/onboarding/acces"
          className="flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-muted-foreground transition-all hover:bg-muted"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Retour
        </Link>
        <button
          onClick={handleProvision}
          disabled={!canSubmit || loading}
          className={cn(
            "flex items-center gap-3 rounded-xl bg-primary px-8 py-4 font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all",
            canSubmit && !loading
              ? "hover:scale-[1.02] active:scale-95"
              : "cursor-not-allowed opacity-50"
          )}
        >
          {loading ? (
            <>
              <svg
                className="size-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Provisionnement en cours...
            </>
          ) : (
            <>
              Créer mon établissement
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </>
          )}
        </button>
      </footer>
    </div>
  )
}
