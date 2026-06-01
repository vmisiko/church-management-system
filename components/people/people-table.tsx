"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { PeopleFilterState } from "@/lib/people-filters"
import useMembersState from "@/application/member/useMembersState"
import { useMembersPloc } from "@/core/di/DependencyLocator"
import type { Member } from "@/domain/entities/member/Member"

const statusColors: Record<string, string> = {
  guest: "bg-muted text-muted-foreground",
  member: "bg-primary text-primary-foreground",
  leader: "bg-destructive text-destructive-foreground",
}

interface PeopleTableProps {
  filters: PeopleFilterState
}

export function PeopleTable({ filters }: PeopleTableProps) {
  const ploc = useMembersPloc()
  const members = useMembersState((s) => Array.isArray(s.members) ? s.members : [])
  const loading = useMembersState((s) => s.loading)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    ploc.fetchAll()
  }, [ploc])

  const filteredMembers = members.filter((member: Member) => {
    if (filters.status !== "all" && member.status !== filters.status) return false
    if (filters.activityStatus !== "all" && member.activityStatus !== filters.activityStatus) return false
    if (filters.memberType.length > 0 && !filters.memberType.includes(member.memberType)) return false
    if (filters.inFellowship === true && !member.fellowshipId) return false
    if (filters.inFellowship === false && member.fellowshipId) return false
    if (filters.fellowship !== "all" && member.fellowshipId !== filters.fellowship) return false
    if (filters.joinDateRange !== "all") {
      const joined = new Date(member.joinedAt).getTime()
      const now = Date.now()
      const day = 86_400_000
      if (filters.joinDateRange === "week" && now - joined > 7 * day) return false
      if (filters.joinDateRange === "month" && now - joined > 30 * day) return false
      if (filters.joinDateRange === "recently" && now - joined > 14 * day) return false
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / itemsPerPage))
  const paginated = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (loading && members.length === 0) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Congregation Name</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Contact Phone</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Email Address</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No members match the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((member) => {
                const name = `${member.firstName} ${member.lastName}`
                const initials = `${member.firstName[0] ?? ""}${member.lastName[0] ?? ""}`
                return (
                  <TableRow key={member.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatarUrl ?? undefined} alt={name} />
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-primary">{name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{member.phone ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{member.email ?? "—"}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[member.status] ?? "bg-secondary"}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{member.memberType}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t px-6 py-4">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-primary">{filteredMembers.length}</span> of{" "}
          <span className="font-semibold text-primary">{members.length.toLocaleString()}</span>{" "}
          Souls
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(i + 1)}
                className="h-8 w-8"
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
