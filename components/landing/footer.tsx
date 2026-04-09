const footerLinks = [
  { label: "Politique de confidentialité", href: "#" },
  { label: "Conditions d'utilisation", href: "#" },
  { label: "Paramètres des cookies", href: "#" },
  { label: "Contacter le support", href: "#" },
]

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-muted/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-8 py-12 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <span className="font-heading text-lg font-bold text-foreground">
            LogePro
          </span>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            © 2026 LogePro. La plateforme hôtelière intelligente.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground transition-all hover:text-primary hover:opacity-80"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
