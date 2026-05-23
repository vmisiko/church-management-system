import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date consistently to avoid hydration mismatches
export function formatDate(date: Date | string, options?: {
  weekday?: "long" | "short"
  year?: "numeric"
  month?: "long" | "short" | "numeric"
  day?: "numeric"
}): string {
  const d = typeof date === "string" ? new Date(date) : date
  const opts = options || { month: "short", day: "numeric", year: "numeric" }
  // Use a fixed locale to ensure consistent formatting between server and client
  return d.toLocaleDateString("en-US", opts)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  })
}
