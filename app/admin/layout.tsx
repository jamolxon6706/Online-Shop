"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Settings,
  LogOut, Menu, X, ChevronRight, Bell, Search, Moon, Sun,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getToken, getProfile, logout } from "@/lib/api"

const navItems = [
  { href: "/admin",            label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/products",   label: "Mahsulotlar",  icon: Package },
  { href: "/admin/orders",     label: "Buyurtmalar",  icon: ShoppingCart },
  { href: "/admin/customers",  label: "Foydalanuvchilar", icon: Users },
  { href: "/admin/categories", label: "Kategoriyalar", icon: Tag },
  { href: "/admin/settings",   label: "Sozlamalar",   icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<{ first_name?: string; email?: string } | null>(null)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // Check auth
    if (!getToken()) { router.push("/account"); return }
    getProfile().then(p => {
      if (!p) { router.push("/account"); return }
      setUser(p)
    })
    // Theme
    const saved = localStorage.getItem("theme") as "light" | "dark" | null
    if (saved) { setTheme(saved); document.documentElement.classList.toggle("dark", saved === "dark") }
  }, [router])

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light"
    setTheme(next)
    localStorage.setItem("theme", next)
    document.documentElement.classList.toggle("dark", next === "dark")
  }

  const handleLogout = () => { logout(); router.push("/") }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300",
        "lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-border shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <span className="text-background font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-sm">APEX Admin</span>
          </Link>
          <button className="lg:hidden p-1 rounded hover:bg-secondary" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 group",
                  active
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active ? "text-background" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="h-3 w-3 opacity-60" />}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="border-t border-border p-3 shrink-0">
          <div className="flex items-center gap-3 rounded-xl bg-secondary px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold shrink-0">
              {user?.first_name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.first_name || "Admin"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
            </div>
            <button onClick={handleLogout} className="p-1 rounded hover:bg-background transition-colors shrink-0" title="Chiqish">
              <LogOut className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
          <Link href="/" className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-border py-2 text-xs text-muted-foreground hover:bg-secondary transition-colors">
            ← Do'konga qaytish
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/admin" className="hover:text-foreground">Admin</Link>
              {pathname !== "/admin" && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-foreground capitalize">
                    {navItems.find(n => pathname.startsWith(n.href) && n.href !== "/admin")?.label}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
