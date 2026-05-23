"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users, MapPin, Clock, MoreVertical, Edit, Trash2, Eye } from "lucide-react"
import { fellowshipSlug, fellowshipZoneColors, type FellowshipRecord } from "@/lib/fellowships"

interface FellowshipCardProps {
  fellowship: FellowshipRecord
  viewMode: "grid" | "list"
  onEdit?: (fellowship: FellowshipRecord) => void
}

export function FellowshipCard({ fellowship, viewMode, onEdit }: FellowshipCardProps) {
  const slug = fellowshipSlug(fellowship.name)
  const detailsHref = `/fellowships/${slug}`

  const initials = fellowship.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)

  if (viewMode === "list") {
    return (
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link href={detailsHref} className="font-semibold hover:text-primary transition-colors">
                  {fellowship.name}
                </Link>
                <p className="text-sm text-muted-foreground">{fellowship.leader}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Badge className={fellowshipZoneColors[fellowship.zone] || "bg-secondary"}>
                {fellowship.zone}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{fellowship.members} members</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{fellowship.meetingDay}s at {fellowship.meetingTime}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={detailsHref}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit?.(fellowship)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link href={detailsHref} className="font-semibold hover:text-primary transition-colors">
                {fellowship.name}
              </Link>
              <Badge className={`${fellowshipZoneColors[fellowship.zone] || "bg-secondary"} text-xs`}>
                {fellowship.zone}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={detailsHref}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(fellowship)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{fellowship.members}</span>
            <span className="text-muted-foreground">members</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{fellowship.meetingDay}s at {fellowship.meetingTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{fellowship.location}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm">
            <span className="text-muted-foreground">Leader:</span>{" "}
            <span className="font-medium">{fellowship.leader}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
