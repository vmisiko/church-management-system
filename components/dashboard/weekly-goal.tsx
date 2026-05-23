"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface WeeklyGoalProps {
  goal: string
  target: number
  current: number
}

export function WeeklyGoal({ goal, target, current }: WeeklyGoalProps) {
  const percentage = Math.round((current / target) * 100)

  return (
    <Card className="border-0 bg-accent text-accent-foreground shadow-sm">
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold italic">Weekly Goal</h3>
        <p className="text-sm font-medium uppercase tracking-wider mt-1">
          {percentage}% Reached
        </p>
        <Progress
          value={percentage}
          className="mt-3 h-2 bg-accent-foreground/20"
        />
        <p className="mt-3 text-sm">
          {goal}
        </p>
      </CardContent>
    </Card>
  )
}
