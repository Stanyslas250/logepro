"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Stepper } from "@/components/onboarding/stepper"
import { cn } from "@/lib/utils"

export default function ComptePage() {
  const router = useRouter()
  const [mode, setMode] = useState<"signup" | "login">("signup")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmSent, setConfirmSent] = useState(false)

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

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.")
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/onboarding/forfait`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.session) {
      setUserEmail(data.user?.email ?? email)
      setLoading(false)
      return
    }

    setConfirmSent(true)
    setLoading(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError(loginError.message)
      setLoading(false)
      return
    }

    setUserEmail(data.user?.email ?? email)
    setLoading(false)
  }

  if (confirmSent) {
    return (
      <div className="flex flex-1 flex-col p-10">
        <header className="mx-auto mb-12 w-full max-w-2xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-heading text-4xl font-extrabold tracking-tight">
                Votre compte
              </h1>
              <p className="mt-2 text-muted-foreground">
                Vérifiez votre boîte mail pour continuer.
              </p>
            </div>
            <Stepper currentStep={1} totalSteps={5} />
          </div>
        </header>
        <section className="mx-auto w-full max-w-2xl flex-1">
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-bold">Vérifiez votre boîte mail</h2>
            <p className="mt-3 text-muted-foreground">
              Un lien de confirmation a été envoyé à{" "}
              <span className="font-medium text-foreground">{email}</span>.
              <br />Cliquez sur le lien pour activer votre compte et continuer la configuration.
            </p>
            <button
              onClick={() => { setConfirmSent(false); setMode("login") }}
              className="mt-6 text-sm font-medium text-primary hover:underline"
            >
              Déjà confirmé ? Se connecter
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col p-10">
      <header className="mx-auto mb-12 w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight">
              Votre compte
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isAuthenticated
                ? "Vous êtes connecté. Passez à l'étape suivante."
                : "Créez votre compte pour configurer votre établissement."}
            </p>
          </div>
          <Stepper currentStep={1} totalSteps={5} />
        </div>
      </header>

      <section className="mx-auto w-full max-w-2xl flex-1">
        {isAuthenticated ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-10 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                  <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-bold text-emerald-700">
                    Compte vérifié
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Connecté en tant que <span className="font-bold text-foreground">{userEmail}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-primary/5 p-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <p className="text-sm leading-snug text-muted-foreground">
                Ce compte sera le propriétaire principal de votre établissement.
                Vous pourrez inviter des collaborateurs plus tard.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-10 shadow-sm">
            <div className="mb-8 flex rounded-lg bg-muted p-1">
              <button
                onClick={() => { setMode("signup"); setError(null) }}
                className={cn(
                  "flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-all",
                  mode === "signup"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Créer un compte
              </button>
              <button
                onClick={() => { setMode("login"); setError(null) }}
                className={cn(
                  "flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-all",
                  mode === "login"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Se connecter
              </button>
            </div>

            <form
              onSubmit={mode === "signup" ? handleSignup : handleLogin}
              className="space-y-5"
            >
              {mode === "signup" && (
                <div>
                  <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">
                    Nom complet
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jean Dupont"
                    required
                    className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                  />
                </div>
              )}

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
                  className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "6 caractères minimum" : "••••••••"}
                  required
                  minLength={mode === "signup" ? 6 : undefined}
                  className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "flex h-11 w-full items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground transition-all",
                  loading ? "cursor-not-allowed opacity-70" : "hover:opacity-90 active:scale-[0.98]"
                )}
              >
                {loading
                  ? "Chargement..."
                  : mode === "signup"
                    ? "Créer mon compte"
                    : "Se connecter"}
              </button>
            </form>
          </div>
        )}
      </section>

      <footer className="mx-auto mt-auto flex w-full max-w-2xl items-center justify-between border-t border-border py-10">
        <div />
        {isAuthenticated ? (
          <button
            onClick={() => router.push("/onboarding/forfait")}
            className="flex items-center gap-3 rounded-xl bg-primary px-8 py-4 font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            Continuer
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        ) : (
          <span className="flex cursor-not-allowed items-center gap-3 rounded-xl bg-primary/50 px-8 py-4 font-bold text-primary-foreground">
            Créez un compte pour continuer
          </span>
        )}
      </footer>
    </div>
  )
}
