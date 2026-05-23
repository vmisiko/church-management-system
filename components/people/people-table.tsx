"use client"

import { useState } from "react"
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
import type { PeopleFilterState } from "@/lib/people-filters"
import { mockMembers, type Member } from "@/lib/members"

const statusColors = {
  Guest: "bg-muted text-muted-foreground",
  Member: "bg-primary text-primary-foreground",
  Leader: "bg-destructive text-destructive-foreground",
}

function isWithinJoinDateRange(joinedAt: string, range: string): boolean {
  if (range === "all") return true

  const joined = new Date(joinedAt)
  const now = new Date("2026-05-20")
  const diffDays = Math.floor((now.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24))

  if (range === "recently") return diffDays <= 14
  if (range === "week") return diffDays <= 7
  if (range === "month") return diffDays <= 30
  return true
}

function matchesInFellowship(member: Member, inFellowship: boolean | null): boolean {
  if (inFellowship === null) return true
  const memberInFellowship = member.fellowship !== "None"
  return inFellowship ? memberInFellowship : !memberInFellowship
}

interface PeopleTableProps {
  filters: PeopleFilterState
}

export function PeopleTable({ filters }: PeopleTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredMembers = mockMembers.filter((member) => {
    if (filters.status !== "all" && member.status !== filters.status) {
      return false
    }
    if (!matchesInFellowship(member, filters.inFellowship)) {
      return false
    }
    if (filters.fellowship !== "all" && member.fellowship !== filters.fellowship) {
      return false
    }
    if (filters.department !== "all" && member.department !== filters.department) {
      return false
    }
    if (
      filters.memberType.length > 0 &&
      !filters.memberType.includes(member.memberType)
    ) {
      return false
    }
    if (
      filters.activityStatus !== "all" &&
      member.activityStatus !== filters.activityStatus
    ) {
      return false
    }
    if (!isWithinJoinDateRange(member.joinedAt, filters.joinDateRange)) {
      return false
    }
    return true
  })

  const totalMembers = 2480
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / itemsPerPage))

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                Congregation Name
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                Contact Phone
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                Email Address
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                Fellowship
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No members match the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-primary">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{member.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{member.email}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[member.status]}>{member.status}</Badge>
                  </TableCell>
                  <TableCell>{member.fellowship}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t px-6 py-4">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-primary">{filteredMembers.length}</span> of{" "}
          <span className="font-semibold text-primary">{totalMembers.toLocaleString()}</span>{" "}
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
