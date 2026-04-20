"use client"

import { useState } from "react"
import { ChevronDownIcon } from "./icons"

const faqs = [
  {
    q: "Combien de temps pour configurer LogePro ?",
    a: "La plupart de nos clients sont opérationnels en moins de 30 minutes. Nous importons votre inventaire de chambres et vos tarifs, et l'équipe est formée en une séance de 45 min.",
  },
  {
    q: "Puis-je utiliser LogePro hors ligne ?",
    a: "Oui. Notre application fonctionne même sans connexion : les saisies sont synchronisées automatiquement dès le retour du réseau.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Toutes les données sont chiffrées en AES-256 au repos et en transit. Nos serveurs sont conformes RGPD, LIDP (CI) et nous effectuons des sauvegardes toutes les 6h.",
  },
  {
    q: "Puis-je changer de plan à tout moment ?",
    a: "Absolument. Passez à un plan supérieur à tout moment depuis votre espace, le prorata est calculé automatiquement. Aucun engagement.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Mobile Money (Airtel Money, Moov Money), carte bancaire, virement bancaire. Facturation en FCFA ou EUR selon votre zone.",
  },
  {
    q: "Proposez-vous un support en français ?",
    a: "Oui, notre équipe support est francophone, basée au Gabon, et disponible 24/7 pour les plans Pro et Business.",
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="relative bg-muted/30 py-28 md:py-36">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
            FAQ
          </div>
          <h2 className="font-heading text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Questions fréquentes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tout ce que vous devez savoir avant de vous lancer.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  isOpen
                    ? "border-primary/40 bg-card shadow-lg shadow-primary/5"
                    : "border-border/60 bg-card/60 hover:border-border"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-semibold text-foreground">
                    {item.q}
                  </span>
                  <ChevronDownIcon
                    className={`size-5 shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          Encore une question ?{" "}
          <a href="#" className="font-semibold text-primary hover:underline">
            Écrivez-nous →
          </a>
        </div>
      </div>
    </section>
  )
}
