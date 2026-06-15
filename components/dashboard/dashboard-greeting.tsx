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
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
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
      {/* Left — oversized Fraunces greeting */}
      <div>
        <p
          className="rise rise-1 font-mono text-[9px] uppercase tracking-[0.3em] mb-3"
          style={{ color: 'oklch(0.72 0.14 78 / 0.55)' }}
        >
          {date}
        </p>
        <h1
          className="rise rise-2 font-display font-light italic leading-[1.05]"
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            color: 'oklch(0.93 0.005 75)',
          }}
        >
          {greeting}
          <br />
          <span style={{ color: 'oklch(0.72 0.14 78)' }}>Pastor.</span>
        </h1>
        <p
          className="rise rise-3 mt-3 text-[13px]"
          style={{ color: 'oklch(0.50 0.01 75)' }}
        >
          Here&apos;s a summary of City Mega Church — week in review.
        </p>
      </div>

      {/* Right — action buttons */}
      <div className="rise rise-3 flex items-center gap-2.5 shrink-0">
        <button
          className="flex items-center gap-2 rounded px-4 py-2 text-[12px] font-medium cursor-pointer transition-colors hover:bg-secondary"
          style={{
            border: '1px solid oklch(0.20 0.015 252)',
            color: 'oklch(0.50 0.01 75)',
          }}
        >
          <FileText className="h-3.5 w-3.5" />
          Generate Report
        </button>
        <button
          className="flex items-center gap-2 rounded px-4 py-2 text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-90"
          style={{
            background: 'oklch(0.72 0.14 78 / 0.12)',
            border: '1px solid oklch(0.72 0.14 78 / 0.35)',
            color: 'oklch(0.72 0.14 78)',
            boxShadow: '0 0 16px oklch(0.72 0.14 78 / 0.10)',
          }}
        >
          <Radio className="h-3.5 w-3.5" />
          Live Stream
        </button>
      </div>
    </div>
  )
}
