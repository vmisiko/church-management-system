"use client"

import { useEffect, useState } from "react"
import { Analytics } from "@vercel/analytics/next"

export function AnalyticsWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Delay mounting to ensure router is fully initialized
    const timer = setTimeout(() => {
      setMounted(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return null
  }

  return <Analytics />
}
