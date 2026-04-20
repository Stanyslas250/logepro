"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRightIcon } from "./icons"

const navLinks = [
  { label: "Plateforme", href: "#plateforme" },
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "Témoignages", href: "#temoignages" },
  { label: "Tarifs", href: "#tarifs" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 transition-all duration-300",
          scrolled
            ? "rounded-2xl border border-border/60 bg-background/70 px-4 py-2 shadow-lg shadow-black/5 backdrop-blur-xl md:px-6"
            : "border border-transparent"
        )}
      >
        <a href="#" className="flex items-center gap-2.5">
          <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-primary to-chart-2 shadow-lg shadow-primary/30">
            <span className="absolute inset-0 bg-linear-to-tr from-white/30 via-transparent to-transparent" />
            <span className="relative font-heading text-base font-black text-primary-foreground">
              L
            </span>
          </span>
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            LogePro
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
         
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href="/onboarding/forfait" />}
            className="gap-1.5 shadow-md shadow-primary/25"
          >
            Commencer
            <ArrowRightIcon className="size-3.5" />
          </Button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent md:hidden"
            aria-label="Menu"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="4" y1="4" x2="16" y2="16" />
                  <line x1="16" y1="4" x2="4" y2="16" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="17" y2="6" />
                  <line x1="3" y1="10" x2="17" y2="10" />
                  <line x1="3" y1="14" x2="17" y2="14" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mx-4 mt-2 rounded-2xl border border-border/60 bg-background/95 p-4 shadow-xl backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="my-2 h-px bg-border" />
            <Button
              variant="ghost"
              size="sm"
              className="justify-start"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Connexion
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
