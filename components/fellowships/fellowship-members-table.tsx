"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Member } from "@/lib/members"

const statusColors = {
  Guest: "bg-muted text-muted-foreground",
  Member: "bg-primary text-primary-foreground",
  Leader: "bg-destructive text-destructive-foreground",
}

const activityColors = {
  active: "bg-success/20 text-success",
  inactive: "bg-muted text-muted-foreground",
}

interface FellowshipMembersTableProps {
  members: Member[]
  totalCount: number
}

export function FellowshipMembersTable({ members, totalCount }: FellowshipMembersTableProps) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                Name
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                Phone
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                Email
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                Department
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                Activity
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No members assigned to this fellowship yet.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id} className="hover:bg-muted/50">
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
                  <TableCell>{member.department ?? "—"}</TableCell>
                  <TableCell>
                    <Badge className={activityColors[member.activityStatus]}>
                      {member.activityStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-primary">{members.length}</span> of{" "}
            <span className="font-semibold text-primary">{totalCount.toLocaleString()}</span>{" "}
            members
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
