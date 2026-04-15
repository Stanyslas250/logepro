"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: "dashboard" },
  { href: "/reservations", label: "Réservations", icon: "calendar_month" },
  { href: "/rooms", label: "Chambres", icon: "bed" },
  { href: "/guests", label: "Clients", icon: "group" },
  { href: "/housekeeping", label: "Ménage", icon: "cleaning_services" },
  { href: "/reports", label: "Rapports", icon: "bar_chart" },
  { href: "/support", label: "Support", icon: "support_agent" },
]

const bottomItems = [
  { href: "/settings", label: "Paramètres", icon: "settings" },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-card text-primary font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t border-border px-3 pt-4">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-card text-primary font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}

        <Link
          href="/reservations/new"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-90"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Nouvelle Réservation
        </Link>
      </div>
    </>
  )
}
