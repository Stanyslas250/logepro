"use client"

import { useState } from "react"
import Link from "next/link"
import { useOnboarding } from "@/components/onboarding/onboarding-context"
import { OnboardingShell } from "@/components/onboarding/shell"
import { ArrowRightIcon, SparkleIcon } from "@/components/landing/icons"
import { cn } from "@/lib/utils"

const ROLES = [
  { value: "manager", label: "Manager", color: "bg-violet-500/15 text-violet-600 border-violet-500/30" },
  { value: "receptionniste", label: "Réceptionniste", color: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
  { value: "menage", label: "Ménage", color: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  { value: "comptable", label: "Comptable", color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
] as const

const AVATAR_GRADIENTS = [
  "from-primary to-chart-2",
  "from-chart-1 to-primary",
  "from-chart-2 to-chart-1",
  "from-(--success) to-chart-1",
  "from-primary to-(--success)",
]

function getRoleStyle(role: string) {
  return ROLES.find((r) => r.value === role)?.color ?? "bg-muted text-muted-foreground border-border"
}

function getRoleLabel(role: string) {
  return ROLES.find((r) => r.value === role)?.label ?? role
}

export default function AccesPage() {
  const { invitations, addInvitation, removeInvitation } = useOnboarding()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("receptionniste")
  const [error, setError] = useState<string | null>(null)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Veuillez entrer une adresse email valide.")
      return
    }
    if (invitations.some((inv) => inv.email === trimmed)) {
      setError("Cette adresse a déjà été ajoutée.")
      return
    }

    addInvitation(trimmed, role)
    setEmail("")
    setRole("receptionniste")
  }

  return (
    <OnboardingShell maxWidth="max-w-5xl">
      <div className="mb-6 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
            <SparkleIcon className="size-3" />
            Étape 4 · Équipe
          </span>
          Invitez vos collaborateurs
        </span>
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
          Constituez votre{" "}
          <span className="relative inline-block">
            <span className="bg-linear-to-r from-primary via-chart-2 to-chart-1 bg-clip-text text-transparent">
              équipe
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
          Ajoutez les adresses email de vos collaborateurs avec le rôle
          approprié. Ils recevront une invitation à la finalisation.
        </p>
      </div>

      {/* Form */}
      <div className="mt-10 rounded-2xl border border-border/40 bg-card/70 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl md:p-8">
        <h3 className="font-heading mb-5 text-base font-bold">
          Inviter un collaborateur
        </h3>
        <form onSubmit={handleAdd} className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="flex-1">
            <label htmlFor="inv-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Adresse email
            </label>
            <input
              id="inv-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null) }}
              placeholder="collaborateur@exemple.com"
              className="h-11 w-full rounded-lg border border-border/60 bg-background/70 px-4 text-sm outline-none backdrop-blur transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="w-full md:w-56">
            <label htmlFor="inv-role" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Rôle
            </label>
            <select
              id="inv-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-11 w-full rounded-lg border border-border/60 bg-background/70 px-3 text-sm outline-none backdrop-blur transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-linear-to-r from-primary to-chart-2 px-5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Ajouter
          </button>
        </form>
        {error && (
          <p className="mt-3 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>

      {/* Invitations list */}
      <div className="mt-6">
        {invitations.length > 0 ? (
          <div className="rounded-2xl border border-border/40 bg-card/70 shadow-xl shadow-primary/5 backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-border/40 px-6 py-4">
              <h3 className="font-heading text-base font-bold">
                Invitations prévues
              </h3>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                {invitations.length}
              </span>
            </div>
            <ul className="divide-y divide-border/40">
              {invitations.map((inv, i) => (
                <li key={i} className="flex items-center justify-between gap-3 px-6 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-primary-foreground shadow-sm",
                        AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
                      )}
                    >
                      {inv.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{inv.email}</p>
                      <span
                        className={cn(
                          "mt-0.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                          getRoleStyle(inv.role)
                        )}
                      >
                        {getRoleLabel(inv.role)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeInvitation(i)}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Supprimer l'invitation"
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 bg-card/30 py-14 text-center backdrop-blur">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-chart-2/20 text-primary">
              <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <p className="font-heading text-lg font-bold">Aucune invitation</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                Ajoutez vos collaborateurs ci-dessus, ou passez cette étape pour
                les inviter plus tard.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sticky actions */}
      <div className="sticky bottom-4 mt-10 flex items-center justify-between rounded-2xl border border-border/40 bg-card/80 p-4 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <Link
          href="/onboarding/structure"
          className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg className="size-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
          Retour
        </Link>
        <Link
          href="/onboarding/revision"
          className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-primary to-chart-2 px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
        >
          {invitations.length > 0 ? "Continuer" : "Passer cette étape"}
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </OnboardingShell>
  )
}
