"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { FellowshipDetailsContent } from "@/components/fellowships/fellowship-details-content"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import { useFellowshipsPloc } from "@/core/di/DependencyLocator"
import useFellowshipsState from "@/application/fellowship/useFellowshipsState"

export default function FellowshipDetailsPage() {
  const params = useParams()
  const slug = params.slug as string
  const ploc = useFellowshipsPloc()
  const fellowship = useFellowshipsState((s) => s.currentFellowship)
  const loading = useFellowshipsState((s) => s.loading)

  useEffect(() => {
    ploc.fetchBySlug(slug)
  }, [ploc, slug])

  if (loading && !fellowship) {
    return (
      <AppShell>
        <div className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </AppShell>
    )
  }

  if (!fellowship) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center p-6 min-h-[50vh] text-center">
          <h1 className="text-2xl font-bold mb-2">Fellowship Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The fellowship you are looking for does not exist or may have been removed.
          </p>
          <Button asChild className="gap-2">
            <Link href="/fellowships">
              <ArrowLeft className="h-4 w-4" />
              Back to Fellowships
            </Link>
          </Button>
        </div>
      </AppShell>
    )
  }

  return <FellowshipDetailsContent fellowship={fellowship} />
}
