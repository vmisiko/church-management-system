"use client"

interface WeeklyGoalProps {
  goal: string
  target: number
  current: number
}

export function WeeklyGoal({ goal, target, current }: WeeklyGoalProps) {
  const pct = Math.round((current / target) * 100)

  return (
    /* Permanently dark anchor card — intentional visual contrast in both themes */
    <div
      className="relative overflow-hidden rounded-xl p-5"
      style={{
        background: "#0E1B25",
        border: "1px solid rgba(227,176,75,.20)",
        boxShadow: "0 0 30px rgba(227,176,75,.06)",
      }}
    >
      {/* Embossed ring */}
      <div
        className="pointer-events-none absolute -right-10 -bottom-10 h-44 w-44 rounded-full"
        style={{
          border: "1px solid rgba(227,176,75,.06)",
          boxShadow: "inset 0 0 0 16px rgba(227,176,75,.025)",
        }}
      />
      <div className="relative">
        <p
          className="font-mono text-[8px] uppercase tracking-[0.28em]"
          style={{ color: "rgba(227,176,75,.50)" }}
        >
          Weekly Goal
        </p>
        <p
          className="font-display font-light italic mt-1 leading-none"
          style={{ fontSize: "3rem", color: "#E3B04B" }}
        >
          {pct}<span className="text-2xl" style={{ opacity: 0.45 }}>%</span>
        </p>
        <div
          className="mt-3 h-px w-full overflow-hidden rounded-full"
          style={{ background: "rgba(227,176,75,.12)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #A87C2A, #F4C667)",
              boxShadow: "0 0 8px rgba(227,176,75,.5)",
            }}
          />
        </div>
        <p
          className="mt-3 text-[11.5px] leading-relaxed"
          style={{ color: "rgba(207,200,186,.65)" }}
        >
          {goal}
        </p>
        <p
          className="mt-2 font-mono text-[9px] uppercase tracking-widest"
          style={{ color: "rgba(227,176,75,.50)" }}
        >
          {current} / {target} reached
        </p>
      </div>
    </div>
  )
}
