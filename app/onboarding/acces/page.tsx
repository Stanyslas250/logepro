"use client"

import { useState } from "react"
import Link from "next/link"
import { useOnboarding } from "@/components/onboarding/onboarding-context"
import { Stepper } from "@/components/onboarding/stepper"
import { cn } from "@/lib/utils"

const ROLES = [
  { value: "manager", label: "Manager", color: "bg-violet-500/10 text-violet-700 border-violet-500/20" },
  { value: "receptionniste", label: "Réceptionniste", color: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
  { value: "menage", label: "Ménage", color: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  { value: "comptable", label: "Comptable", color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
] as const

function getRoleStyle(role: string) {
  return ROLES.find((r) => r.value === role)?.color ?? "bg-muted text-muted-foreground"
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
    <div className="flex flex-1 flex-col p-10">
      <header className="mx-auto mb-12 w-full max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight">
              Accès utilisateurs
            </h1>
            <p className="mt-2 text-muted-foreground">
              Invitez vos collaborateurs et définissez leurs rôles.
            </p>
          </div>
          <Stepper currentStep={4} totalSteps={5} />
        </div>
      </header>

      <section className="mx-auto w-full max-w-5xl flex-1 space-y-8">
        {/* Invitation form */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h3 className="font-heading mb-6 text-lg font-bold">
            Inviter un collaborateur
          </h3>
          <form onSubmit={handleAdd} className="flex items-end gap-4">
            <div className="flex-1">
              <label htmlFor="inv-email" className="mb-1.5 block text-sm font-medium">
                Adresse email
              </label>
              <input
                id="inv-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null) }}
                placeholder="collaborateur@exemple.com"
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <div className="w-52">
              <label htmlFor="inv-role" className="mb-1.5 block text-sm font-medium">
                Rôle
              </label>
              <select
                id="inv-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
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
              className="flex h-11 items-center gap-2 rounded-lg bg-primary px-6 font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-95"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        {invitations.length > 0 ? (
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-8 py-5">
              <h3 className="font-heading text-lg font-bold">
                Invitations prévues
                <span className="ml-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-semibold text-primary">
                  {invitations.length}
                </span>
              </h3>
            </div>
            <ul className="divide-y divide-border">
              {invitations.map((inv, i) => (
                <li key={i} className="flex items-center justify-between px-8 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted font-heading text-sm font-bold text-muted-foreground">
                      {inv.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{inv.email}</p>
                      <span className={cn(
                        "mt-0.5 inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        getRoleStyle(inv.role)
                      )}>
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
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-muted/30 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <p className="font-heading text-lg font-bold">Aucune invitation</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Ajoutez les adresses email de vos collaborateurs ci-dessus,
                ou passez cette étape pour les inviter plus tard.
              </p>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="flex items-center gap-4 rounded-xl bg-primary/5 p-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <p className="text-sm leading-snug text-muted-foreground">
            Les invitations seront envoyées lors de la finalisation.
            Vous pourrez également gérer les accès depuis votre tableau de bord.
          </p>
        </div>
      </section>

      <footer className="mx-auto mt-auto flex w-full max-w-5xl items-center justify-between border-t border-border py-10">
        <Link
          href="/onboarding/structure"
          className="flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-muted-foreground transition-all hover:bg-muted"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Retour
        </Link>
        <Link
          href="/onboarding/revision"
          className="flex items-center gap-3 rounded-xl bg-primary px-8 py-4 font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          {invitations.length > 0 ? "Passer à la révision" : "Passer cette étape"}
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </footer>
    </div>
  )
}
