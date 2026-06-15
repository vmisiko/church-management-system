"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  Users,
  Church,
  Building2,
  Package,
  CalendarCheck,
  MessageSquare,
  Bell,
  Search,
  ChevronDown,
  Plus,
  Boxes,
  FileWarning,
  ClipboardList,
  LogOut,
  Settings,
  User,
  Sun,
  Moon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"
import useAuthState from "@/application/auth/useAuthState"
import { useAuthPloc } from "@/core/di/DependencyLocator"

const navGroups = [
  {
    label: "Overview",
    items: [{ name: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "People",
    items: [
      { name: "Members", href: "/people", icon: Users },
      { name: "Fellowships", href: "/fellowships", icon: Church },
      { name: "Departments", href: "/departments", icon: Building2 },
    ],
  },
  {
    label: "Inventory",
    items: [
      { name: "Items", href: "/inventory", icon: Package },
      { name: "Categories", href: "/inventory/categories", icon: Boxes },
      { name: "Stock", href: "/inventory/stock", icon: ClipboardList },
      { name: "Damage Reports", href: "/inventory/damage-reports", icon: FileWarning },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Attendance", href: "/attendance", icon: CalendarCheck },
      { name: "Messaging", href: "/messaging", icon: MessageSquare },
    ],
  },
]

/* Circular gold seal — matches reference radial gradient seal */
function CircularSeal({ isDark, size = 44 }: { isDark: boolean; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: "radial-gradient(circle at 35% 32%, #F4C667 0%, #E3B04B 45%, #A87C2A 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: Math.round(size * 0.38),
        color: "#1c1206",
        letterSpacing: "-0.01em",
        boxShadow: isDark
          ? "0 0 0 1px rgba(227,176,75,.45), 0 6px 20px -6px rgba(227,176,75,.55)"
          : "0 0 0 1px rgba(168,124,42,.28), 0 2px 8px rgba(168,124,42,.12)",
      }}
    >
      CM
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const ploc = useAuthPloc()
  const { accessToken, currentUser } = useAuthState()
  const { theme, setTheme } = useTheme()
  const [currentPath, setCurrentPath] = useState("/")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setCurrentPath(window.location.pathname)
    setMounted(true)
    const handlePopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  useEffect(() => {
    if (mounted && !accessToken) router.push("/login")
  }, [mounted, accessToken, router])

  useEffect(() => {
    if (accessToken && !currentUser) ploc.fetchMe()
  }, [accessToken, currentUser, ploc])

  const allHrefs = navGroups.flatMap(g => g.items.map(i => i.href))

  const isActive = (href: string) => {
    if (!mounted) return false
    const hasExact = allHrefs.includes(currentPath)
    return currentPath === href || (!hasExact && href !== "/" && currentPath.startsWith(href + "/"))
  }

  const handleNav = (href: string) => {
    setCurrentPath(href)
    window.location.href = href
  }

  const isDark = mounted && theme === "dark"
  const userInitials = currentUser?.email?.slice(0, 2).toUpperCase() ?? "??"
  const userRole = currentUser?.role?.replace("_", " ") ?? ""

  let stagger = 0

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside
        className="hidden w-64 shrink-0 flex-col relative lg:flex overflow-hidden bg-sidebar"
        style={{ borderRight: "1px solid var(--sidebar-border)" }}
      >

        {/* Subtle top atmospheric glow */}
        {isDark && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 120% 30% at 50% 0%, rgba(227,176,75,.07) 0%, transparent 60%)",
            }}
          />
        )}

        {/* ── Logo ── */}
        <div className="relative px-6 pt-8 pb-6 rise rise-1">
          <div className="flex items-center gap-3.5">
            <CircularSeal isDark={isDark} size={44} />
            <div>
              <p
                className="font-display font-light leading-none tracking-wide text-sidebar-foreground"
                style={{ fontSize: "15.5px" }}
              >
                City Mega
              </p>
              <p
                className="font-mono mt-1 uppercase leading-none"
                style={{
                  fontSize: "8px",
                  letterSpacing: "0.3em",
                  color: isDark ? "rgba(227,176,75,.60)" : "var(--muted-foreground)",
                }}
              >
                {isDark ? "The Ledger" : "Administration"}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px" style={{ background: "var(--sidebar-border)" }} />

        {/* ── Navigation ── */}
        <ScrollArea className="relative flex-1 py-5">
          <nav className="flex flex-col gap-5 px-3">
            {navGroups.map((group) => {
              stagger++
              return (
                <div key={group.label} className={`rise rise-${Math.min(stagger + 1, 12)}`}>
                  <p
                    className="font-mono px-3 mb-2 uppercase"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.26em",
                      color: isDark ? "rgba(94,110,120,.9)" : "var(--muted-foreground)",
                    }}
                  >
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {group.items.map((item) => {
                      const active = isActive(item.href)
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={(e) => { e.preventDefault(); handleNav(item.href) }}
                          className={cn(
                            "relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150 cursor-pointer select-none",
                          )}
                          style={
                            active
                              ? isDark
                                ? {
                                    background: "linear-gradient(100deg, #F4C667, #E3B04B)",
                                    color: "#1c1206",
                                    fontWeight: 600,
                                  }
                                : {
                                    background: "oklch(0.72 0.14 78 / 0.12)",
                                    color: "oklch(0.42 0.14 60)",
                                    fontWeight: 600,
                                  }
                              : {
                                  color: isDark ? "#CFC8BA" : "var(--muted-foreground)",
                                }
                          }
                          onMouseEnter={(e) => {
                            if (!active) {
                              const el = e.currentTarget as HTMLAnchorElement
                              el.style.background = isDark ? "rgba(243,237,225,.04)" : "var(--sidebar-accent)"
                              el.style.color = isDark ? "#F3EDE1" : "var(--sidebar-foreground)"
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!active) {
                              const el = e.currentTarget as HTMLAnchorElement
                              el.style.background = "transparent"
                              el.style.color = isDark ? "#CFC8BA" : "var(--muted-foreground)"
                            }
                          }}
                        >
                          <item.icon
                            className="h-[15px] w-[15px] shrink-0"
                            style={{
                              color: active
                                ? isDark ? "#1c1206" : "oklch(0.52 0.14 60)"
                                : "currentColor",
                              opacity: active ? 1 : 0.75,
                            }}
                          />
                          {item.name}
                        </a>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </nav>
        </ScrollArea>

        {/* ── Add Member ── */}
        <div className="relative px-4 pb-4">
          <div className="h-px mb-3" style={{ background: "var(--sidebar-border)" }} />
          <button
            onClick={() => handleNav("/people")}
            className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-[12.5px] font-semibold cursor-pointer transition-opacity hover:opacity-90"
            style={
              isDark
                ? {
                    background: "rgba(227,176,75,.12)",
                    border: "1px solid rgba(227,176,75,.28)",
                    color: "#E3B04B",
                  }
                : {
                    background: "oklch(0.72 0.14 78 / 0.10)",
                    border: "1px solid oklch(0.72 0.14 78 / 0.28)",
                    color: "oklch(0.52 0.14 60)",
                  }
            }
          >
            <Plus className="h-3.5 w-3.5" />
            Add Member
          </button>
        </div>

        {/* ── User profile ── */}
        <div className="relative px-3 pb-5" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="mt-3 w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 cursor-pointer transition-colors hover:bg-sidebar-accent text-left">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback
                    className="text-[10px] font-semibold rounded-lg"
                    style={{
                      background: isDark ? "rgba(227,176,75,.15)" : "oklch(0.72 0.14 78 / 0.12)",
                      color: isDark ? "#E3B04B" : "oklch(0.52 0.14 60)",
                    }}
                  >
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] font-medium leading-none truncate text-sidebar-foreground">
                    {currentUser?.email ?? "Loading…"}
                  </p>
                  <p
                    className="font-mono mt-1 uppercase leading-none capitalize"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.2em",
                      color: isDark ? "rgba(227,176,75,.65)" : "var(--muted-foreground)",
                    }}
                  >
                    {userRole}
                  </p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/30" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-52 mb-1">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><User className="mr-2 h-4 w-4" />Profile Settings</DropdownMenuItem>
              <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Church Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => ploc.logout(() => router.push("/login"))}
              >
                <LogOut className="mr-2 h-4 w-4" />Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">

        {/* Header */}
        <header
          className="flex h-12 shrink-0 items-center justify-between px-6 bg-background"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <CircularSeal isDark={isDark} size={28} />
            <span className="font-display text-sm text-foreground">City Mega</span>
          </div>

          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search records…"
              className="h-7 w-64 pl-8 text-[12px] border-0 bg-secondary focus-visible:ring-1 focus-visible:ring-accent/30"
            />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1.5 ml-auto">

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="flex h-7 w-7 items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-secondary"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark
                  ? <Sun className="h-3.5 w-3.5 text-muted-foreground" />
                  : <Moon className="h-3.5 w-3.5 text-muted-foreground" />
                }
              </button>
            )}

            {/* Notifications */}
            <button className="relative flex h-7 w-7 items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-secondary">
              <Bell className="h-3.5 w-3.5 text-muted-foreground" />
              <span
                className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
                style={{
                  background: isDark ? "#E3B04B" : "oklch(0.72 0.14 78)",
                  boxShadow: isDark ? "0 0 5px rgba(227,176,75,.7)" : "none",
                }}
              />
            </button>

            {/* Mobile avatar */}
            <div className="flex lg:hidden">
              <Avatar className="h-7 w-7">
                <AvatarFallback
                  className="text-[9px]"
                  style={{
                    background: isDark ? "rgba(227,176,75,.15)" : "oklch(0.72 0.14 78 / 0.12)",
                    color: isDark ? "#E3B04B" : "oklch(0.52 0.14 60)",
                  }}
                >
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page content — no inline gradient, body::before handles the atmosphere */}
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
