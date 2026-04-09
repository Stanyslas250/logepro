"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useOnboarding } from "@/components/onboarding/onboarding-context"
import { Stepper } from "@/components/onboarding/stepper"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const planLabels = {
  starter: "Starter",
  pro: "Pro Edition",
  business: "Business",
} as const

export default function RevisionPage() {
  const { plan, floors, roomsPerFloor, totalRooms, orgName, slug, setOrgName } =
    useOnboarding()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingName, setEditingName] = useState(false)

  // Auth state
  const [authChecked, setAuthChecked] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null)
      setAuthChecked(true)
    })
  }, [])

  const isAuthenticated = authChecked && userEmail !== null
  const canSubmit =
    isAuthenticated && orgName.trim().length >= 2 && slug.length >= 2

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
        }),
      })

      const data = await res.json()

      if (res.status === 401) {
        setUserEmail(null)
        setError(null)
        setLoading(false)
        return
      }

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
          <Stepper currentStep={4} totalSteps={4} />
        </div>
      </header>

      <section className="mx-auto w-full max-w-5xl flex-1 space-y-6">
        {/* Auth card — shown if user is not logged in */}
        {authChecked && !isAuthenticated && (
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-8 shadow-sm">
            <div className="flex items-start gap-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg
                  className="size-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-lg font-bold">
                  Connectez-vous pour finaliser
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Un compte est nécessaire pour créer votre établissement. Vos
                  choix (forfait, structure) seront conservés.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Link href="/signup?redirect=/onboarding/revision">
                    <Button className="font-semibold">Créer un compte</Button>
                  </Link>
                  <Link href="/login?redirect=/onboarding/revision">
                    <Button variant="outline" className="font-semibold">
                      Se connecter
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Authenticated badge */}
        {isAuthenticated && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-6 py-4">
            <svg
              className="size-5 text-emerald-600"
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
            <p className="text-sm font-medium text-emerald-700">
              Connecté en tant que{" "}
              <span className="font-bold">{userEmail}</span>
            </p>
          </div>
        )}

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
