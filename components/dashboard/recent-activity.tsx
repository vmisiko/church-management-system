"use client"

interface ActivityItem {
  id: string
  user: { name: string; initials: string }
  action: string
  detail: string
  time: string
  role: string
}

const activities: ActivityItem[] = [
  { id: "1", user: { name: "David Chen", initials: "DC" }, action: "New member registration", detail: "Thika Road Zone", time: "02:14", role: "Member" },
  { id: "2", user: { name: "Sarah Johnson", initials: "SJ" }, action: "Updated fellowship records", detail: "Kawangware Fellowship", time: "01:52", role: "Leader" },
  { id: "3", user: { name: "Mark Thompson", initials: "MT" }, action: "Inventory check completed", detail: "Media Department", time: "01:07", role: "Admin" },
  { id: "4", user: { name: "Grace Williams", initials: "GW" }, action: "Attendance report submitted", detail: "Sunday Service", time: "00:43", role: "Member" },
  { id: "5", user: { name: "James Odhiambo", initials: "JO" }, action: "New fellowship created", detail: "Eastlands Zone", time: "00:11", role: "Leader" },
]

const roleColor: Record<string, string> = {
  Member: 'oklch(0.52 0.14 60)',
  Leader: 'oklch(0.60 0.14 200)',
  Admin: 'oklch(0.72 0.14 78)',
}

export function RecentActivity() {
  return (
    <div
      className="rounded p-5"
      style={{
        background: 'oklch(0.12 0.015 252)',
        border: '1px solid oklch(0.20 0.015 252)',
        boxShadow: '0 2px 12px oklch(0 0 0 / 0.25)',
      }}
    >
      {/* Header */}
      <div className="flex items-baseline gap-3 mb-5">
        <h2
          className="font-display text-[1.4rem] font-light italic"
          style={{ color: 'oklch(0.93 0.005 75)' }}
        >
          The Ledger
        </h2>
        <div
          className="flex-1 h-px"
          style={{ background: 'linear-gradient(90deg, oklch(0.72 0.14 78 / 0.2), transparent)' }}
        />
        <a
          href="/activity"
          className="font-mono text-[9px] uppercase tracking-[0.2em] cursor-pointer hover:opacity-70 transition-opacity"
          style={{ color: 'oklch(0.72 0.14 78 / 0.6)' }}
        >
          View all →
        </a>
      </div>

      {/* Table header */}
      <div
        className="grid gap-3 py-2 mb-1"
        style={{
          gridTemplateColumns: '4rem 1fr 1fr 4rem',
          borderBottom: '1px solid oklch(0.20 0.015 252)',
        }}
      >
        {["Time", "Name", "Action", "Role"].map((h) => (
          <span
            key={h}
            className="font-mono text-[8px] uppercase tracking-[0.25em]"
            style={{ color: 'oklch(0.35 0.01 75)' }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Rows — staggered rise */}
      {activities.map((a, i) => (
        <div
          key={a.id}
          className={`grid gap-3 py-3 rise rise-${Math.min(i + 7, 12)}`}
          style={{
            gridTemplateColumns: '4rem 1fr 1fr 4rem',
            borderBottom: '1px solid oklch(0.17 0.015 252)',
          }}
        >
          {/* Time */}
          <span
            className="font-mono text-[10px] leading-none self-center"
            style={{ color: 'oklch(0.40 0.01 75)' }}
          >
            {a.time}
          </span>

          {/* Name */}
          <span
            className="text-[12.5px] font-medium leading-none self-center truncate"
            style={{ color: 'oklch(0.85 0.005 75)' }}
          >
            {a.user.name}
          </span>

          {/* Action */}
          <span
            className="text-[11px] leading-none self-center truncate"
            style={{ color: 'oklch(0.45 0.01 75)' }}
          >
            {a.action}
          </span>

          {/* Role */}
          <span
            className="font-mono text-[9px] font-semibold uppercase tracking-wider self-center"
            style={{ color: roleColor[a.role] ?? 'oklch(0.50 0.01 75)' }}
          >
            {a.role}
          </span>
        </div>
      ))}
    </div>
  )
}
