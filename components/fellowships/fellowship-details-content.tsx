"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AppShell } from "@/components/app-shell"
import { FellowshipMembersTable } from "@/components/fellowships/fellowship-members-table"
import { AddMemberDialog } from "@/components/people/add-member-dialog"
import { AddFellowshipDialog } from "@/components/fellowships/add-fellowship-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  MapPin,
  MessageSquare,
  MoreVertical,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react"
import {
  fellowshipSlug,
  fellowshipZoneColors,
  type FellowshipRecord,
} from "@/lib/fellowships"
import { getMembersByFellowship } from "@/lib/members"

interface FellowshipDetailsContentProps {
  fellowship: FellowshipRecord
}

export function FellowshipDetailsContent({ fellowship }: FellowshipDetailsContentProps) {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [memberSearch, setMemberSearch] = useState("")

  const slug = fellowshipSlug(fellowship.name)
  const initials = fellowship.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)

  const allMembers = getMembersByFellowship(fellowship.name)
  const filteredMembers = useMemo(() => {
    const query = memberSearch.toLowerCase()
    if (!query) return allMembers
    return allMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.phone.includes(query)
    )
  }, [allMembers, memberSearch])

  const activeMembers = allMembers.filter((member) => member.activityStatus === "active").length
  const leaders = allMembers.filter((member) => member.status === "Leader").length

  return (
    <AppShell>
      <div className="p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/fellowships">Fellowships</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{fellowship.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2 gap-2" asChild>
            <Link href="/fellowships">
              <ArrowLeft className="h-4 w-4" />
              Back to Fellowships
            </Link>
          </Button>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{fellowship.name}</h1>
                  <Badge
                    className={fellowshipZoneColors[fellowship.zone] || "bg-secondary"}
                  >
                    {fellowship.zone}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      fellowship.status === "active"
                        ? "border-success text-success"
                        : "border-muted-foreground text-muted-foreground"
                    }
                  >
                    {fellowship.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground max-w-2xl">{fellowship.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button className="gap-2" asChild>
                <Link href={`/messaging?fellowship=${slug}`}>
                  <MessageSquare className="h-4 w-4" />
                  Send Message
                </Link>
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => setIsAddMemberOpen(true)}>
                <UserPlus className="h-4 w-4" />
                Add Member
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => setIsEditOpen(true)}>
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Calendar className="h-4 w-4 mr-2" />
                    View Attendance
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deactivate Fellowship
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{fellowship.members}</p>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <Users className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeMembers}</p>
                  <p className="text-sm text-muted-foreground">Active (in records)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <Users className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{leaders}</p>
                  <p className="text-sm text-muted-foreground">Leaders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                  <Clock className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-sm">{fellowship.meetingDay}s</p>
                  <p className="text-sm text-muted-foreground">{fellowship.meetingTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members ({allMembers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Fellowship Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Leader</p>
                    <p className="font-medium">{fellowship.leader}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Zone</p>
                    <p className="font-medium">{fellowship.zone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{fellowship.status}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Meeting Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Schedule</p>
                      <p className="font-medium">
                        {fellowship.meetingDay}s at {fellowship.meetingTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{fellowship.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">About This Fellowship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{fellowship.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <FellowshipMembersTable members={filteredMembers} totalCount={fellowship.members} />
          </TabsContent>
        </Tabs>

        <AddMemberDialog
          open={isAddMemberOpen}
          onOpenChange={setIsAddMemberOpen}
          defaultFellowshipSlug={slug}
        />
        <AddFellowshipDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          fellowship={fellowship}
        />
      </div>
    </AppShell>
  )
}
