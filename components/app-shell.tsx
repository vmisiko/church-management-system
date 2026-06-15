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
} from "lucide-react"
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

function GoldSeal({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2L18.5 6.5V17.5C18.5 18.881 17.381 20 16 20H8C6.619 20 5.5 18.881 5.5 17.5V6.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <line x1="12" y1="7.5" x2="12" y2="15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="8.5" y1="11" x2="15.5" y2="11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const ploc = useAuthPloc()
  const { accessToken, currentUser } = useAuthState()
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

  const userInitials = currentUser?.email?.slice(0, 2).toUpperCase() ?? "??"
  const userRole = currentUser?.role?.replace("_", " ") ?? ""

  /* running index for stagger */
  let stagger = 0

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'oklch(0.09 0.015 252)' }}>

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside
        className="hidden w-[224px] shrink-0 flex-col relative lg:flex overflow-hidden"
        style={{ background: 'oklch(0.09 0.015 252)' }}
      >
        {/* Subtle top-down gold glow inside sidebar only */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 140% 35% at 50% 0%, oklch(0.72 0.14 78 / 0.06) 0%, transparent 55%)',
          }}
        />

        {/* Gold vertical rule — right edge, separating sidebar from content */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-px"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, oklch(0.72 0.14 78 / 0.45) 20%, oklch(0.72 0.14 78 / 0.45) 80%, transparent 100%)',
          }}
        />

        {/* ── Logo ── */}
        <div className="relative px-5 pt-7 pb-5 rise rise-1">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm relative"
              style={{
                background: 'oklch(0.72 0.14 78 / 0.10)',
                border: '1px solid oklch(0.72 0.14 78 / 0.35)',
                boxShadow: '0 0 18px oklch(0.72 0.14 78 / 0.22), 0 0 40px oklch(0.72 0.14 78 / 0.08)',
              }}
            >
              <GoldSeal className="text-sidebar-primary" />
            </div>
            <div>
              <p
                className="font-display text-[15px] font-light leading-none tracking-wide"
                style={{ color: 'oklch(0.93 0.005 75)' }}
              >
                City Mega
              </p>
              <p
                className="font-mono text-[8px] mt-0.5 uppercase tracking-[0.3em] leading-none"
                style={{ color: 'oklch(0.72 0.14 78 / 0.65)' }}
              >
                Private Ledger
              </p>
            </div>
          </div>
        </div>

        {/* Gold rule */}
        <div className="mx-5 h-px" style={{ background: 'oklch(0.72 0.14 78 / 0.14)' }} />

        {/* ── Navigation ── */}
        <ScrollArea className="relative flex-1 py-5">
          <nav className="flex flex-col gap-5 px-3">
            {navGroups.map((group) => {
              stagger++
              return (
                <div key={group.label} className={`rise rise-${Math.min(stagger + 1, 12)}`}>
                  <p
                    className="font-mono px-2 mb-1.5 text-[8px] uppercase tracking-[0.3em]"
                    style={{ color: 'oklch(0.72 0.14 78 / 0.40)' }}
                  >
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-px">
                    {group.items.map((item) => {
                      const active = isActive(item.href)
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={(e) => { e.preventDefault(); handleNav(item.href) }}
                          className={cn(
                            "relative flex items-center gap-2.5 rounded px-2 py-2 text-[12.5px] font-medium transition-all duration-150 cursor-pointer select-none",
                            active
                              ? "text-sidebar-foreground"
                              : "text-sidebar-foreground/40 hover:text-sidebar-foreground/70"
                          )}
                          style={active ? { background: 'oklch(0.72 0.14 78 / 0.08)' } : undefined}
                        >
                          {active && (
                            <span
                              className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full"
                              style={{
                                background: 'oklch(0.72 0.14 78)',
                                boxShadow: '0 0 8px oklch(0.72 0.14 78 / 0.6)',
                              }}
                            />
                          )}
                          <item.icon
                            className="h-[14px] w-[14px] shrink-0"
                            style={{ color: active ? 'oklch(0.72 0.14 78)' : undefined }}
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
          <div className="h-px mb-3" style={{ background: 'oklch(0.72 0.14 78 / 0.12)' }} />
          <button
            onClick={() => handleNav("/people")}
            className="w-full flex items-center justify-center gap-2 rounded py-2 text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-90"
            style={{
              background: 'oklch(0.72 0.14 78 / 0.12)',
              border: '1px solid oklch(0.72 0.14 78 / 0.3)',
              color: 'oklch(0.72 0.14 78)',
            }}
          >
            <Plus className="h-3 w-3" />
            Add Member
          </button>
        </div>

        {/* ── User profile ── */}
        <div className="relative px-3 pb-5" style={{ borderTop: '1px solid oklch(0.72 0.14 78 / 0.10)' }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="mt-3 w-full flex items-center gap-2 rounded px-2 py-2 cursor-pointer transition-colors hover:bg-sidebar-accent/50 text-left">
                <Avatar className="h-6 w-6 shrink-0">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback
                    className="text-[9px] font-semibold"
                    style={{ background: 'oklch(0.72 0.14 78 / 0.15)', color: 'oklch(0.72 0.14 78)' }}
                  >
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium leading-none truncate" style={{ color: 'oklch(0.92 0.005 75)' }}>
                    {currentUser?.email ?? "Loading…"}
                  </p>
                  <p className="text-[9px] font-mono uppercase tracking-wider mt-0.5 capitalize" style={{ color: 'oklch(0.72 0.14 78 / 0.65)' }}>
                    {userRole}
                  </p>
                </div>
                <ChevronDown className="h-3 w-3 shrink-0" style={{ color: 'oklch(0.72 0.14 78 / 0.4)' }} />
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
          className="flex h-12 shrink-0 items-center justify-between px-6"
          style={{
            background: 'oklch(0.09 0.015 252)',
            borderBottom: '1px solid oklch(0.18 0.015 252)',
          }}
        >
          <div className="flex items-center gap-4">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 lg:hidden">
              <GoldSeal className="text-accent" />
              <span className="font-display text-sm">City Mega</span>
            </div>

            {/* Search */}
            <div className="relative hidden sm:block">
              <Search
                className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2"
                style={{ color: 'oklch(0.50 0.01 75)' }}
              />
              <Input
                placeholder="Search records…"
                className="h-7 w-64 pl-8 text-[12px] border-0 focus-visible:ring-1 focus-visible:ring-accent/30"
                style={{ background: 'oklch(0.13 0.015 252)', color: 'oklch(0.93 0.005 75)' }}
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button className="relative flex h-7 w-7 items-center justify-center rounded cursor-pointer transition-colors hover:bg-secondary">
              <Bell className="h-3.5 w-3.5" style={{ color: 'oklch(0.50 0.01 75)' }} />
              <span
                className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full"
                style={{ background: 'oklch(0.72 0.14 78)', boxShadow: '0 0 4px oklch(0.72 0.14 78)' }}
              />
            </button>

            {/* Mobile avatar */}
            <div className="flex lg:hidden">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[9px]" style={{ background: 'oklch(0.72 0.14 78 / 0.15)', color: 'oklch(0.72 0.14 78)' }}>
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-auto"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 80% 5%, oklch(0.72 0.14 78 / 0.055) 0%, transparent 55%),
              radial-gradient(ellipse 60% 70% at 10% 90%, oklch(0.45 0.15 260 / 0.07) 0%, transparent 55%),
              oklch(0.09 0.015 252)
            `,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
