"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  Users,
  Sparkles,
  BarChart3,
  LifeBuoy,
  Settings,
  Plus,
  type LucideIcon,
} from "lucide-react"

type NavItem = { href: string; label: string; icon: LucideIcon }

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/reservations", label: "Réservations", icon: CalendarDays },
  { href: "/rooms", label: "Chambres", icon: BedDouble },
  { href: "/guests", label: "Clients", icon: Users },
  { href: "/housekeeping", label: "Ménage", icon: Sparkles },
  { href: "/reports", label: "Rapports", icon: BarChart3 },
  { href: "/support", label: "Support", icon: LifeBuoy },
]

const bottomItems: NavItem[] = [
  { href: "/settings", label: "Paramètres", icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname()

  const renderItem = (item: NavItem) => {
    const isActive =
      pathname === item.href || pathname.startsWith(item.href + "/")
    const Icon = item.icon
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`group relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
          isActive
            ? "bg-accent text-foreground font-medium"
            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
        }`}
      >
        {isActive && (
          <span
            aria-hidden
            className="absolute inset-y-1.5 left-0 w-[2px] rounded-full bg-primary"
          />
        )}
        <Icon className="size-[15px] shrink-0" strokeWidth={1.75} />
        <span className="truncate">{item.label}</span>
      </Link>
    )
  }

  return (
    <>
      <div className="mb-2 px-2 pt-1">
        <p className="px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
          Workspace
        </p>
      </div>
      <nav className="flex-1 space-y-0.5 px-2">
        {navItems.map(renderItem)}
      </nav>

      <div className="mt-auto space-y-0.5 px-2 pt-2">
        <Link
          href="/reservations/new"
          className="mb-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-background py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-accent"
        >
          <Plus className="size-[14px]" strokeWidth={2} />
          Nouvelle réservation
        </Link>
        <div className="my-2 border-t border-border/60" />
        {bottomItems.map(renderItem)}
      </div>
    </>
  )
}
