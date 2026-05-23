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
  HelpCircle,
  Plus,
  Boxes,
  FileWarning,
  ClipboardList,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const navGroups = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "People Management",
    items: [
      { name: "People", href: "/people", icon: Users },
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

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [currentPath, setCurrentPath] = useState("/")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Only access window.location after mounting on the client
    setCurrentPath(window.location.pathname)
    setMounted(true)

    // Listen for navigation changes
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const handleNavigation = (href: string) => {
    setCurrentPath(href)
    window.location.href = href
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-lg">
            CM
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">City Mega</span>
            <span className="text-xs text-sidebar-foreground/70 uppercase tracking-wider">Administration</span>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-6">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  {group.label}
                </p>
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => {
                    const isActive = mounted && (currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href)))
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault()
                          handleNavigation(item.href)
                        }}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </a>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Add Member Button */}
        <div className="border-t border-sidebar-border p-4">
          <Button 
            className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
            onClick={() => handleNavigation("/people")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>

        {/* Help Center */}
        <div className="border-t border-sidebar-border p-4">
          <a
            href="/help"
            onClick={(e) => {
              e.preventDefault()
              handleNavigation("/help")
            }}
            className="flex items-center gap-3 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors cursor-pointer"
          >
            <HelpCircle className="h-5 w-5" />
            Help Center
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-primary hidden md:block">CITY MEGA CHURCH</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search members, events, records..."
                className="w-80 pl-9 bg-secondary border-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">Pastor Profile</p>
                    <p className="text-xs text-muted-foreground">Super Admin</p>
                  </div>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Pastor" />
                    <AvatarFallback className="bg-primary text-primary-foreground">PA</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Church Settings</DropdownMenuItem>
                <DropdownMenuItem>Activity Log</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
