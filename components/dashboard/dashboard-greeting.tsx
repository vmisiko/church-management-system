"use client"

import { useEffect, useState } from "react"
import { FileText, Radio } from "lucide-react"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning,"
  if (h < 17) return "Good afternoon,"
  return "Good evening,"
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  }).toUpperCase()
}

export function DashboardGreeting() {
  const [greeting, setGreeting] = useState("Good morning,")
  const [date, setDate] = useState("")

  useEffect(() => {
    setGreeting(getGreeting())
    setDate(getFormattedDate())
  }, [])

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="rise rise-1 font-mono text-[9px] uppercase tracking-[0.28em] mb-3 text-muted-foreground">
          City Mega Church · {date}
        </p>
        <h1
          className="rise rise-2 font-display font-light italic leading-[1.02] text-foreground"
          style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.5rem)", letterSpacing: "-0.015em", fontWeight: 340 }}
        >
          {greeting}
          <br />
          <span style={{ color: "var(--primary)" }}>Pastor.</span>
        </h1>
        <p className="rise rise-3 mt-3 text-[12.5px]" style={{ color: "var(--muted-foreground)" }}>
          Here&apos;s a summary of City Mega Church — week in review.
        </p>
      </div>

      <div className="rise rise-3 flex items-center gap-2.5 shrink-0">
        <button
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-[12px] font-medium cursor-pointer transition-colors hover:bg-secondary text-muted-foreground"
          style={{ border: "1px solid var(--border)" }}
        >
          <FileText className="h-3.5 w-3.5" />
          Generate Report
        </button>
        <button
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-90"
          style={{
            background: "rgba(192,139,42,.08)",
            border: "1px solid rgba(192,139,42,.28)",
            color: "var(--primary)",
          }}
        >
          <Radio className="h-3.5 w-3.5" />
          Live Stream
        </button>
      </div>
    </div>
  )
}
