"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, MessageSquare, Search, X } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { toMemberQueryParams, type PeopleFilterState } from "@/lib/people-filters"
import useMembersState from "@/application/member/useMembersState"
import { useMembersPloc } from "@/core/di/DependencyLocator"
import useMessageRecipientsStore from "@/application/messaging/useMessageRecipientsStore"

const statusColors: Record<string, string> = {
  guest: "bg-muted text-muted-foreground",
  member: "bg-primary text-primary-foreground",
  leader: "bg-destructive text-destructive-foreground",
}

interface PeopleTableProps {
  filters: PeopleFilterState
  onMemberClick?: (memberId: string) => void
}

const PAGE_SIZE = 100

export function PeopleTable({ filters, onMemberClick }: PeopleTableProps) {
  const router = useRouter()
  const ploc = useMembersPloc()
  const members = useMembersState((s) => Array.isArray(s.members) ? s.members : [])
  const total = useMembersState((s) => s.total)
  const loading = useMembersState((s) => s.loading)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const setRecipients = useMessageRecipientsStore((s) => s.setRecipients)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 400)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    setCurrentPage(1)
    setSelectedIds(new Set())
    ploc.fetchAll({
      ...toMemberQueryParams(filters),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      page: 1,
      limit: PAGE_SIZE,
    })
  }, [ploc, filters, debouncedSearch])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  function goToPage(page: number) {
    setCurrentPage(page)
    setSelectedIds(new Set())
    ploc.fetchAll({
      ...toMemberQueryParams(filters),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      page,
      limit: PAGE_SIZE,
    })
  }

  const allPageSelected = members.length > 0 && members.every((m) => selectedIds.has(m.id))
  const somePageSelected = members.some((m) => selectedIds.has(m.id)) && !allPageSelected

  function toggleAll() {
    if (allPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        members.forEach((m) => next.delete(m.id))
        return next
      })
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        members.forEach((m) => next.add(m.id))
        return next
      })
    }
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleMessageSelected() {
    const ids = Array.from(selectedIds)
    const selectedMembers = members
      .filter((m) => selectedIds.has(m.id))
      .map((m) => ({ id: m.id, firstName: m.firstName, lastName: m.lastName, phone: m.phone }))
    setRecipients(selectedMembers)
    router.push(`/messaging?memberIds=${ids.join(",")}`)
  }

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
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="mx-4 mb-2 flex items-center justify-between rounded-lg border bg-primary/5 px-4 py-2.5">
          <span className="text-sm font-medium text-primary">
            {selectedIds.size} member{selectedIds.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" className="gap-2" onClick={handleMessageSelected}>
              <MessageSquare className="h-4 w-4" />
              Message selected
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setSelectedIds(new Set())}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-10 pl-4">
                <Checkbox
                  checked={allPageSelected}
                  data-state={somePageSelected ? "indeterminate" : undefined}
                  onCheckedChange={toggleAll}
                  aria-label="Select all on page"
                />
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Congregation Name</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Contact Phone</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Email Address</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No members match the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => {
                const name = `${member.firstName} ${member.lastName}`
                const initials = `${member.firstName[0] ?? ""}${member.lastName[0] ?? ""}`
                const checked = selectedIds.has(member.id)
                return (
                  <TableRow
                    key={member.id}
                    className={`hover:bg-muted/50 ${checked ? "bg-primary/5" : ""}`}
                  >
                    <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleOne(member.id)}
                        aria-label={`Select ${name}`}
                      />
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      onClick={() => onMemberClick?.(member.id)}
                    >
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
          {total > 0 ? (
            <>
              Showing{" "}
              <span className="font-semibold text-primary">
                {((currentPage - 1) * PAGE_SIZE + 1).toLocaleString()}–
                {Math.min(currentPage * PAGE_SIZE, total).toLocaleString()}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-primary">{total.toLocaleString()}</span>{" "}
              Souls
            </>
          ) : (
            "0 Souls"
          )}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {(() => {
              const windowStart = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
              const windowEnd = Math.min(totalPages, windowStart + 4)
              return Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => {
                const page = windowStart + i
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="icon"
                    onClick={() => goToPage(page)}
                    disabled={loading}
                    className="h-8 w-8"
                  >
                    {page}
                  </Button>
                )
              })
            })()}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
