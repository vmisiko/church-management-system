"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ActivityItem {
  id: string
  user: {
    name: string
    avatar?: string
    initials: string
  }
  action: string
  detail: string
  time: string
  badge?: {
    text: string
    variant: "default" | "secondary" | "outline"
  }
}

const activities: ActivityItem[] = [
  {
    id: "1",
    user: { name: "David Chen", initials: "DC" },
    action: "New member registration",
    detail: "Thika Road Zone",
    time: "2 mins ago",
    badge: { text: "Member", variant: "default" },
  },
  {
    id: "2",
    user: { name: "Sarah Johnson", initials: "SJ" },
    action: "Updated fellowship records",
    detail: "Kawangware Fellowship",
    time: "15 mins ago",
    badge: { text: "Leader", variant: "secondary" },
  },
  {
    id: "3",
    user: { name: "Mark Thompson", initials: "MT" },
    action: "Inventory check completed",
    detail: "Media Department",
    time: "1 hour ago",
    badge: { text: "Admin", variant: "outline" },
  },
  {
    id: "4",
    user: { name: "Grace Williams", initials: "GW" },
    action: "Attendance report submitted",
    detail: "Sunday Service",
    time: "3 hours ago",
    badge: { text: "Member", variant: "default" },
  },
]

export function RecentActivity() {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <Button variant="link" className="text-primary p-0 h-auto" asChild>
          <a href="/activity">View Log</a>
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">
                  <span className="font-semibold">{activity.user.name}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.action} &bull; {activity.detail}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-primary whitespace-nowrap">{activity.time}</span>
              {activity.badge && (
                <Badge variant={activity.badge.variant} className="text-xs">
                  {activity.badge.text}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
