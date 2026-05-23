"use client"

import { AlertTriangle, Package, Calendar, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AlertItem {
  id: string
  type: "inventory" | "anniversary" | "reminder"
  title: string
  description: string
  action: string
}

const alerts: AlertItem[] = [
  {
    id: "1",
    type: "inventory",
    title: "Low Inventory",
    description: "Hymn books: 12 remaining",
    action: "Refill",
  },
  {
    id: "2",
    type: "anniversary",
    title: "Anniversary",
    description: "Lang'ata Fellowship: 5 yrs",
    action: "Plan",
  },
]

const alertStyles = {
  inventory: {
    bg: "bg-destructive/10",
    iconBg: "bg-destructive/20",
    iconColor: "text-destructive",
    actionColor: "text-destructive hover:text-destructive/80",
  },
  anniversary: {
    bg: "bg-accent/20",
    iconBg: "bg-accent/30",
    iconColor: "text-accent-foreground",
    actionColor: "text-primary hover:text-primary/80",
  },
  reminder: {
    bg: "bg-primary/10",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
    actionColor: "text-primary hover:text-primary/80",
  },
}

const alertIcons = {
  inventory: Package,
  anniversary: Calendar,
  reminder: RefreshCw,
}

export function PriorityAlerts() {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Priority Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {alerts.map((alert) => {
          const styles = alertStyles[alert.type]
          const Icon = alertIcons[alert.type]

          return (
            <div
              key={alert.id}
              className={`flex items-center justify-between rounded-lg p-3 ${styles.bg}`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles.iconBg}`}>
                  <Icon className={`h-5 w-5 ${styles.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{alert.title}</p>
                  <p className="text-xs text-muted-foreground">{alert.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className={`text-xs font-semibold uppercase ${styles.actionColor}`}>
                {alert.action}
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
