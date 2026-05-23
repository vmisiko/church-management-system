"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { FellowshipDetailsContent } from "@/components/fellowships/fellowship-details-content"
import { Button } from "@/components/ui/button"
import { getFellowshipBySlug } from "@/lib/fellowships"
import { ArrowLeft } from "lucide-react"

export default function FellowshipDetailsPage() {
  const params = useParams()
  const slug = params.slug as string
  const fellowship = getFellowshipBySlug(slug)

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
