const columns = [
  {
    title: "Produit",
    links: [
      { label: "Fonctionnalités", href: "#fonctionnalites" },
      { label: "Tarifs", href: "#tarifs" },
      { label: "Témoignages", href: "#temoignages" },
      { label: "Nouveautés", href: "#" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Centre d'aide", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Statut API", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Carrières", href: "#" },
      { label: "Presse", href: "#" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Confidentialité", href: "#" },
      { label: "CGU", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Mentions légales", href: "#" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-muted/40">
      <div className="pointer-events-none absolute -top-32 left-1/2 size-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-primary to-chart-2 shadow-lg shadow-primary/30">
                <span className="absolute inset-0 bg-linear-to-tr from-white/30 via-transparent to-transparent" />
                <span className="relative font-heading text-base font-black text-primary-foreground">
                  L
                </span>
              </span>
              <span className="font-heading text-xl font-bold tracking-tight text-foreground">
                LogePro
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              La plateforme hôtelière intelligente, conçue pour l&apos;Afrique
              et pensée pour le monde.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                {
                  label: "X",
                  path: "M13.5 2h3.3l-7.2 8.3L18 22h-6.7l-5.2-6.8L.2 22H-3l7.7-8.8L-4.5 2h6.9l4.7 6.2L13.5 2z",
                },
                {
                  label: "LinkedIn",
                  path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-.9 1.8-1.9 3.7-1.9 4 0 4.7 2.6 4.7 6V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z",
                },
                {
                  label: "YouTube",
                  path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.6V8.4l6.4 3.6-6.4 3.6z",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 LogePro. Fait avec ❤️ au Gabon.
          </p>
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--success) opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-(--success)" />
            </span>
            Tous les systèmes opérationnels
          </div>
        </div>
      </div>
    </footer>
  )
}
