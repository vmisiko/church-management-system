"use client"

interface WeeklyGoalProps {
  goal: string
  target: number
  current: number
}

export function WeeklyGoal({ goal, target, current }: WeeklyGoalProps) {
  const pct = Math.round((current / target) * 100)

  return (
    <div
      className="relative overflow-hidden rounded p-5"
      style={{
        background: 'oklch(0.12 0.015 252)',
        border: '1px solid oklch(0.72 0.14 78 / 0.18)',
        boxShadow: '0 0 30px oklch(0.72 0.14 78 / 0.06)',
      }}
    >
      {/* Embossed ring */}
      <div
        className="pointer-events-none absolute -right-10 -bottom-10 h-44 w-44 rounded-full"
        style={{
          border: '1px solid oklch(0.72 0.14 78 / 0.06)',
          boxShadow: 'inset 0 0 0 16px oklch(0.72 0.14 78 / 0.025)',
        }}
      />

      <div className="relative">
        <p
          className="font-mono text-[8px] uppercase tracking-[0.28em]"
          style={{ color: 'oklch(0.72 0.14 78 / 0.50)' }}
        >
          Weekly Goal
        </p>

        <p
          className="font-display font-light italic mt-1 leading-none"
          style={{ fontSize: '3rem', color: 'oklch(0.72 0.14 78)' }}
        >
          {pct}
          <span className="text-2xl opacity-50">%</span>
        </p>

        {/* Track */}
        <div
          className="mt-3 h-px w-full overflow-hidden rounded-full"
          style={{ background: 'oklch(0.72 0.14 78 / 0.12)' }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, oklch(0.60 0.14 78), oklch(0.78 0.14 78))',
              boxShadow: '0 0 8px oklch(0.72 0.14 78 / 0.5)',
            }}
          />
        </div>

        <p
          className="mt-3 text-[11.5px] leading-relaxed"
          style={{ color: 'oklch(0.42 0.01 75)' }}
        >
          {goal}
        </p>

        <p
          className="mt-2 font-mono text-[9px] uppercase tracking-widest"
          style={{ color: 'oklch(0.72 0.14 78 / 0.55)' }}
        >
          {current} / {target} reached
        </p>
      </div>
    </div>
  )
}
