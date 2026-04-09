import type { ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth/require-auth"
import { getTenantInfo } from "@/lib/supabase/tenant"

export default async function TenantLayout({
  children,
}: {
  children: ReactNode
}) {
  const tenant = await getTenantInfo()

  if (!tenant) {
    redirect("/")
  }

  const user = await requireAuth()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-border bg-sidebar">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2 2 7l10 5 10-5-10-5Z" />
              <path d="m2 17 10 5 10-5" />
              <path d="m2 12 10 5 10-5" />
            </svg>
          </div>
          <span className="font-heading text-base font-bold text-sidebar-foreground">
            LogePro
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <NavLink href="/dashboard" label="Tableau de bord">
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </NavLink>
          <NavLink href="/rooms" label="Chambres">
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
              <path d="M2 20h20" />
              <path d="M14 12v.01" />
            </svg>
          </NavLink>
        </nav>

        {/* User */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-sidebar-accent text-sm font-bold text-sidebar-accent-foreground">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {user.email}
              </p>
              <p className="text-xs capitalize text-muted-foreground">
                {user.role ?? "membre"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center border-b border-border bg-background/80 px-8 backdrop-blur-sm">
          {tenant && (
            <p className="text-sm font-medium text-muted-foreground">
              {tenant.tenantSchema.replace("tenant_", "").replace(/_/g, " ")}
            </p>
          )}
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}

function NavLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      {children}
      {label}
    </Link>
  )
}
