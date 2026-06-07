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
import type { Fellowship } from "@/domain/entities/fellowship/Fellowship"

interface FellowshipCardProps {
  fellowship: Fellowship
  zoneName: string
  viewMode: "grid" | "list"
  onEdit?: (fellowship: Fellowship) => void
  onDelete?: (fellowship: Fellowship) => void
}

export function FellowshipCard({ fellowship, zoneName, viewMode, onEdit, onDelete }: FellowshipCardProps) {
  const detailsHref = `/fellowships/${fellowship.slug}`
  const membersHref = `/people?fellowshipId=${fellowship.id}`

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
                <p className="text-sm text-muted-foreground">{fellowship.memberCount} members</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Badge className="bg-secondary">
                {zoneName}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{fellowship.meetingDay}s at {fellowship.meetingTime}</span>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={membersHref}>
                  <Users className="h-4 w-4 mr-2" />
                  Members
                </Link>
              </Button>
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
                  <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(fellowship)}>
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
              <Badge className="bg-secondary text-xs">{zoneName}</Badge>
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
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(fellowship)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{fellowship.meetingDay}s at {fellowship.meetingTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{fellowship.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{fellowship.memberCount} members</span>
          </div>
        </div>
        <div className="mt-4">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={membersHref}>
              <Users className="h-4 w-4 mr-2" />
              Members
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
