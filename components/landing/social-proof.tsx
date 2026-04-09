const brands = ["HÔTEL IVOIRE", "LE MÉRIDIEN", "PALM ROYALE", "AZUR RÉSIDENCE"]

export function SocialProof() {
  return (
    <section className="bg-muted/50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-12 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Approuvé par les meilleurs établissements
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0 md:gap-24">
          {brands.map((brand) => (
            <span
              key={brand}
              className="font-heading text-2xl font-black tracking-tighter text-foreground"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
