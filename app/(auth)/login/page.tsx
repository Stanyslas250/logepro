"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

interface OrgChoice {
  id: string
  name: string
  slug: string
  url: string
}

function LoginForm() {
  const searchParams = useSearchParams()
  const explicitRedirect = searchParams.get("redirect")

  const [mode, setMode] = useState<"password" | "magic">("password")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magicSent, setMagicSent] = useState(false)
  const [orgChoices, setOrgChoices] = useState<OrgChoice[] | null>(null)

  async function resolveAndRedirect() {
    // If we're on a tenant subdomain, stay there
    if (explicitRedirect) {
      window.location.href = explicitRedirect
      return
    }

    // Otherwise, look up the user's orgs to find the right subdomain
    try {
      const res = await fetch("/api/auth/resolve-redirect")
      const data = await res.json()

      if (data.orgs && data.orgs.length > 1) {
        setOrgChoices(data.orgs)
        setLoading(false)
        return
      }

      window.location.href = data.redirect ?? "/onboarding/forfait"
    } catch {
      window.location.href = "/onboarding/forfait"
    }
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    await resolveAndRedirect()
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMagicSent(true)
    setLoading(false)
  }

  // Organisation picker when user has multiple tenants
  if (orgChoices) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="font-heading text-2xl font-extrabold tracking-tight">
            Choisir un établissement
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Vous avez accès à plusieurs établissements
          </p>
        </div>
        <div className="space-y-3">
          {orgChoices.map((org) => (
            <a
              key={org.id}
              href={org.url}
              className="flex items-center gap-4 rounded-xl border border-border p-4 transition-all hover:border-primary/50 hover:bg-primary/5"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 font-heading text-sm font-bold text-primary">
                {org.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{org.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {org.slug}.logepro.app
                </p>
              </div>
              <svg
                className="size-4 text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    )
  }

  if (magicSent) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <svg
            className="size-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
        <h2 className="font-heading text-xl font-bold">
          Vérifiez votre boîte mail
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Un lien de connexion a été envoyé à{" "}
          <span className="font-medium text-foreground">{email}</span>.
        </p>
        <button
          onClick={() => setMagicSent(false)}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Utiliser une autre méthode
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">
          Connexion
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Accédez à votre tableau de bord
        </p>
      </div>

      {/* Mode toggle */}
      <div className="mb-6 flex rounded-lg bg-muted p-1">
        <button
          onClick={() => setMode("password")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
            mode === "password"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Mot de passe
        </button>
        <button
          onClick={() => setMode("magic")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
            mode === "magic"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Lien magique
        </button>
      </div>

      <form
        onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink}
        className="space-y-4"
      >
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            required
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>

        {mode === "password" && (
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-10 w-full rounded-lg font-semibold"
        >
          {loading
            ? "Redirection..."
            : mode === "password"
              ? "Se connecter"
              : "Envoyer le lien"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link
          href="/signup"
          className="font-medium text-primary hover:underline"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  )
}
