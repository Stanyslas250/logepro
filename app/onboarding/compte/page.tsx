"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { OnboardingShell } from "@/components/onboarding/shell"
import { SparkleIcon, StarIcon, ArrowRightIcon } from "@/components/landing/icons"
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
      <OnboardingShell maxWidth="max-w-2xl">
        <div className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
              <SparkleIcon className="size-3" />
              Étape 1
            </span>
            Un email a été envoyé
          </span>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card/70 p-10 text-center shadow-2xl shadow-primary/10 backdrop-blur-xl">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-chart-2/20 text-primary">
            <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight">
            Vérifiez votre boîte mail
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Un lien de confirmation a été envoyé à{" "}
            <span className="font-semibold text-foreground">{email}</span>.
            <br />Cliquez sur le lien pour activer votre compte et continuer.
          </p>
          <button
            onClick={() => { setConfirmSent(false); setMode("login") }}
            className="mt-6 text-sm font-semibold text-primary hover:underline"
          >
            Déjà confirmé ? Se connecter →
          </button>
        </div>
      </OnboardingShell>
    )
  }

  return (
    <OnboardingShell maxWidth="max-w-6xl">
      {/* Announcement */}
      <div className="mb-6 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
            <SparkleIcon className="size-3" />
            Étape 1 · Compte
          </span>
          Commencez en 10 minutes chrono
        </span>
      </div>

      {/* Heading */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
          Créez votre{" "}
          <span className="relative inline-block">
            <span className="bg-linear-to-r from-primary via-chart-2 to-chart-1 bg-clip-text text-transparent">
              compte
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
          {isAuthenticated
            ? "Vous êtes connecté. Passez à l'étape suivante."
            : "Un compte sécurisé pour gérer votre établissement et votre équipe."}
        </p>
      </div>

      {/* Split layout */}
      <div className="mt-12 grid gap-8 lg:grid-cols-5 lg:items-start">
        {/* Left — form */}
        <div className="lg:col-span-3">
          {isAuthenticated ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-border/40 bg-card/70 p-8 shadow-2xl shadow-primary/10 backdrop-blur-xl">
                <div className="flex items-center gap-5">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-(--success)/15 text-(--success)">
                    <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      Compte vérifié
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Connecté en tant que{" "}
                      <span className="font-semibold text-foreground">{userEmail}</span>
                    </p>
                  </div>
                </div>
              </div>
              <p className="rounded-xl border border-border/40 bg-card/40 p-4 text-sm leading-relaxed text-muted-foreground backdrop-blur">
                Ce compte sera le propriétaire principal de votre établissement.
                Vous pourrez inviter des collaborateurs à l&apos;étape 4.
              </p>
              <button
                onClick={() => router.push("/onboarding/forfait")}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-chart-2 px-7 text-base font-bold text-primary-foreground shadow-xl shadow-primary/30 transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Continuer vers le forfait
                <ArrowRightIcon className="size-4" />
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/40 bg-card/70 p-8 shadow-2xl shadow-primary/10 backdrop-blur-xl">
              <div className="mb-6 flex rounded-xl bg-muted/60 p-1">
                <button
                  onClick={() => { setMode("signup"); setError(null) }}
                  className={cn(
                    "flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
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
                    "flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
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
                className="space-y-4"
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
                      className="h-11 w-full rounded-lg border border-border/60 bg-background/70 px-4 text-sm outline-none backdrop-blur transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                    className="h-11 w-full rounded-lg border border-border/60 bg-background/70 px-4 text-sm outline-none backdrop-blur transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                    className="h-11 w-full rounded-lg border border-border/60 bg-background/70 px-4 text-sm outline-none backdrop-blur transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                    "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-chart-2 text-base font-bold text-primary-foreground shadow-xl shadow-primary/30 transition-all",
                    loading
                      ? "cursor-not-allowed opacity-70"
                      : "hover:-translate-y-0.5 active:scale-[0.98]"
                  )}
                >
                  {loading
                    ? "Chargement..."
                    : mode === "signup"
                      ? "Créer mon compte"
                      : "Se connecter"}
                  {!loading && <ArrowRightIcon className="size-4" />}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right — social proof panel */}
        <aside className="lg:col-span-2 lg:sticky lg:top-28">
          <div className="rounded-2xl border border-border/40 bg-card/60 p-7 shadow-xl shadow-primary/5 backdrop-blur-xl">
            {/* Rating */}
            <div className="mb-5 flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="size-4 text-amber-500" />
                ))}
              </div>
              <span className="text-sm font-bold text-foreground">4.9/5</span>
              <span className="text-xs text-muted-foreground">· 120+ avis</span>
            </div>

            <h3 className="font-heading text-xl font-extrabold tracking-tight">
              Rejoignez 120+ hôteliers africains
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Des palaces d&apos;Abidjan aux maisons d&apos;hôtes de Dakar,
              LogePro équipe déjà toute l&apos;Afrique de l&apos;Ouest.
            </p>

            {/* Avatars */}
            <div className="mt-6 flex items-center">
              <div className="flex -space-x-2">
                {["AD", "FK", "MY", "SB", "RK"].map((n, i) => (
                  <div
                    key={n}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold text-primary-foreground shadow-sm",
                      i === 0 && "bg-linear-to-br from-primary to-chart-2",
                      i === 1 && "bg-linear-to-br from-chart-1 to-primary",
                      i === 2 && "bg-linear-to-br from-chart-2 to-chart-1",
                      i === 3 && "bg-linear-to-br from-(--success) to-chart-1",
                      i === 4 && "bg-linear-to-br from-primary to-(--success)"
                    )}
                  >
                    {n}
                  </div>
                ))}
              </div>
              <span className="ml-3 text-xs text-muted-foreground">
                + 120 propriétaires
              </span>
            </div>

            {/* Mini testimonial */}
            <blockquote className="mt-6 border-l-2 border-primary/40 pl-4 text-sm italic leading-relaxed text-muted-foreground">
              « Configuré mon hôtel 32 chambres en 8 minutes. Le lendemain,
              toute l&apos;équipe était formée. »
              <footer className="mt-2 text-xs not-italic font-semibold text-foreground">
                — Awa D., Hôtel Le Baobab
              </footer>
            </blockquote>

            {/* Trust row */}
            <div className="mt-6 flex items-center gap-2 border-t border-border/40 pt-5 text-xs text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--success) opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-(--success)" />
              </span>
              Sans engagement · Support FR 24/7
            </div>
          </div>
        </aside>
      </div>
    </OnboardingShell>
  )
}
