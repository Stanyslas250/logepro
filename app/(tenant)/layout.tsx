import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth/require-auth"
import { getTenantInfo } from "@/lib/supabase/tenant"
import { SidebarNav } from "@/components/layout/sidebar-nav"

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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-sidebar py-6">
        {/* Branding */}
        <div className="mb-8 px-6">
          <h1 className="font-heading text-xl font-bold tracking-tighter text-primary">
            LogePro
          </h1>
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {tenantName}
          </p>
        </div>

        {/* Nav */}
        <SidebarNav />

        {/* User */}
        <div className="mt-4 border-t border-border px-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-foreground">
                {user.email.split("@")[0]}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {user.role ?? "membre"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-xl">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[18px]">
                search
              </span>
              <input
                className="w-full rounded-full border-none bg-muted py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
                placeholder="Rechercher une réservation, un nom..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-muted-foreground hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-destructive" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  )
}
