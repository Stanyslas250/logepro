const brands = [
  "HÔTEL IVOIRE",
  "LE MÉRIDIEN",
  "PALM ROYALE",
  "AZUR RÉSIDENCE",
  "LAGUNE PALACE",
  "SAVANE SUITES",
  "TERANGA HÔTEL",
  "BAOBAB RESORT",
]

const stats = [
  { value: "120+", label: "Hôtels partenaires" },
  { value: "3,2M+", label: "Nuitées gérées" },
  { value: "98%", label: "Taux de satisfaction" },
  { value: "24/7", label: "Support francophone" },
]

export function SocialProof() {
  return (
    <section className="relative border-y border-border/60 bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Ils ont choisi LogePro pour piloter leur établissement
        </p>

        {/* Marquee */}
        <div className="relative mb-14 overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-16">
            {[...brands, ...brands].map((brand, i) => (
              <span
                key={`${brand}-${i}`}
                className="shrink-0 font-heading text-xl font-black tracking-tighter text-foreground/40 transition-colors hover:text-foreground"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-y-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="bg-linear-to-br from-foreground to-foreground/60 bg-clip-text font-heading text-3xl font-extrabold tracking-tight text-transparent md:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
