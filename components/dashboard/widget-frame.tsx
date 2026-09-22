"use client"

import type { ReactNode } from "react"
import { Skeleton } from "@/components/ui/skeleton"

/** Card shell with a title, used for the loading, error and empty states of the dashboard widgets. */
export function WidgetFrame({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <h2 className="font-display text-[1.4rem] font-light italic text-foreground">{title}</h2>
      {subtitle && (
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] mt-0.5 text-muted-foreground">{subtitle}</p>
      )}
      <div className="mt-5">{children}</div>
    </div>
  )
}

export function WidgetLoading({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  )
}

export function WidgetError({ message = "Couldn't load this section." }: { message?: string }) {
  return (
    <p className="py-6 text-center text-[12px]" role="alert" style={{ color: "#EB6A56" }}>
      {message}
    </p>
  )
}

export function WidgetEmpty({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-[12px] text-muted-foreground">{children}</p>
}
