import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { Bell, Search } from "lucide-react"
import { requireAuth } from "@/lib/auth/require-auth"
import { getTenantInfo } from "@/lib/supabase/tenant"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { ThemeToggle } from "@/components/layout/theme-toggle"

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

  const tenantName = tenant.tenantSchema
    .replace("tenant_", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-border bg-sidebar py-3">
        {/* Branding */}
        <div className="mb-4 flex items-center gap-2.5 px-4">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="font-heading text-[13px] font-bold">L</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold leading-tight text-foreground">
              {tenantName}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              LogePro
            </p>
          </div>
        </div>

        {/* Nav */}
        <SidebarNav />

        {/* User */}
        <div className="mt-2 border-t border-border/60 px-3 pt-3">
          <div className="flex items-center gap-2.5 rounded-md px-1.5 py-1.5">
            <div className="flex size-7 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-foreground">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-foreground">
                {user.email.split("@")[0]}
              </p>
              <p className="truncate text-[10.5px] text-muted-foreground">
                {user.role ?? "membre"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex flex-1 flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-border bg-background/85 px-6 backdrop-blur-md">
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <span className="font-medium text-foreground">{tenantName}</span>
          </div>

          <div className="hidden md:flex items-center">
            <button className="group inline-flex h-8 min-w-[280px] items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 text-[12.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Search className="size-[14px]" strokeWidth={1.75} />
              <span className="flex-1 text-left">Rechercher…</span>
              <kbd className="hidden rounded border border-border bg-background px-1.5 py-px font-mono text-[10px] text-muted-foreground sm:inline">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Notifications"
              className="relative inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Bell className="size-[15px]" strokeWidth={1.75} />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
            </button>
            <ThemeToggle />
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1400px] flex-1 px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
