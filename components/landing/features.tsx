export function Features() {
  return (
    <section id="fonctionnalites" className="bg-background py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 text-center">
          <h2 className="mb-6 font-heading text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            La Suite de Gestion Moderne
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Des outils de précision pour une hospitalité sans friction.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Tableau de bord unifié */}
          <div className="group relative overflow-hidden rounded-3xl bg-card transition-all hover:shadow-2xl md:col-span-8">
            <div className="p-10 md:w-1/2">
              <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="9" rx="1" />
                  <rect x="14" y="3" width="7" height="5" rx="1" />
                  <rect x="14" y="12" width="7" height="9" rx="1" />
                  <rect x="3" y="16" width="7" height="5" rx="1" />
                </svg>
              </div>
              <h3 className="mb-4 font-heading text-3xl font-bold tracking-tight">
                Tableau de bord unifié
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Un centre névralgique pour votre établissement. Chaque
                interaction, demande et indicateur sont rassemblés dans une vue
                unique et claire.
              </p>
            </div>
            <div className="p-6 md:absolute md:inset-y-0 md:right-0 md:w-1/2">
              <div className="h-full overflow-hidden rounded-2xl border border-border/10 bg-muted shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-full w-full object-cover"
                  alt="Tableau de bord de gestion hôtelière"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUxplFpw0U2aGRcadKWA7dc_FZcQQZ9xdpR4zrpLf_F9bDHfMEFXaxTXoEvYJAQiZxaf5NBqwbDVVp8Z60feQi3Xi6jUDHIB9jhsICI-TtlMiJ3Ypp1hkdsJTTXQ8EHuhKY-B1u-35IYpsM7DEoXYV6fIQKBd5293YatMhqEZlRXS4z8kvQ4wNXFsRQSWDE9doIh_jlmIp-90DwqQSL0HJtMez16uFXTtS8zA6Ml8S4z3eYso2C5qzL_ZGMoopNAt3FUBbyJRAjtM"
                />
              </div>
            </div>
          </div>

          {/* Calendrier de réservation */}
          <div className="group overflow-hidden rounded-3xl bg-card p-10 transition-all hover:shadow-2xl md:col-span-4">
            <div className="flex h-full flex-col">
              <div className="grow">
                <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h3 className="mb-4 font-heading text-2xl font-bold tracking-tight">
                  Calendrier de réservation dynamique
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Visualisez les arrivées et les départs grâce à notre timeline
                  continue. Code couleur par statut pour une clarté
                  opérationnelle instantanée.
                </p>
              </div>
              <div className="mt-8 border-t border-border/20 pt-8">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-primary">
                  <span>Occupation en direct</span>
                  <span>+12% vs AN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Analyses clients */}
          <div className="group overflow-hidden rounded-3xl bg-card transition-all hover:shadow-2xl md:col-span-5">
            <div className="p-10">
              <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                  <path d="M3 20h18" />
                </svg>
              </div>
              <h3 className="mb-4 font-heading text-2xl font-bold tracking-tight">
                Analyses approfondies des clients
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Anticipez les besoins avant qu&apos;ils ne se manifestent. Des
                profils clients détaillés synthétisent les comportements passés,
                les préférences et les retours en actions concrètes.
              </p>
            </div>
            <div className="px-6 pb-6">
              <div className="h-48 overflow-hidden rounded-xl bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-full w-full object-cover"
                  alt="Profil client détaillé sur tablette"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1dpku0SNizV5JYDznKzZ5NyQfHLEJn4YpDqfGM5eFYajEx2PlgS9JftewQodLw1Wu8VCOkVTTo6UIrrqF6hNYRudcWEdGfqkw0M0LuCrQgXJJsLyCfSO9Si1H8uyYzUeC0_g1lJXb8gdwQndEvGIrEUQdBj2UYeLPxLc16aNtf0BuUMiB2DLb2jB-Om976dH0hB6L-9ztuH-8mZc_wNyktNoe9iMzkeieRzsnGrSfiTeRa7IB7m7Wn9uOxg768OO7TVFYo_OHQ68"
                />
              </div>
            </div>
          </div>

          {/* Citation */}
          <div className="group relative overflow-hidden rounded-3xl bg-primary md:col-span-7">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"
              alt="Terrasse d'hôtel au crépuscule"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl07hSer5h540zzRTwP5jd73AxX3toJumOm4xZG4vpqUoHHf0ZjM3W8ISP2YRKA9ylpI7IsfqaCO5DIrRjdg0M6JihCTpavjyJ7nUeV-BAu4jzqE9jPOQQZavS8U104zsaPLdRICxMdLwm93EZYtoVn2NG7V7T6Uo9S0WoWNuTC_PhaQ6hDANBYbvAAOmqemHBRUsuF1nFtMSwGQlyzPp67lZZaSTnIjYK7gXwuNthPePip56YbBMFznTGr8aCQxjjgzShoxjjXeY"
            />
            <div className="relative z-10 flex h-full flex-col justify-end p-12 text-primary-foreground">
              <p className="mb-8 font-heading text-3xl font-bold italic leading-tight">
                «&nbsp;LogePro n&apos;a pas simplement remplacé notre logiciel ;
                il a recentré l&apos;attention de mon équipe sur les
                clients.&nbsp;»
              </p>
              <div>
                <p className="text-lg font-bold">Amadou Diallo</p>
                <p className="text-sm uppercase tracking-widest opacity-80">
                  Directeur, Azur Résidence Abidjan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
