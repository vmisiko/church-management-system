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

const roleConfig: Record<string, { color: string; dot: string }> = {
  Member: { color: "#EFA64A", dot: "#EFA64A" },
  Leader: { color: "#5CA8E0", dot: "#5CA8E0" },
  Admin:  { color: "#E3B04B", dot: "#F4C667" },
}

function AvatarInitials({ initials }: { initials: string }) {
  return (
    <div
      style={{
        width: 28, height: 28, borderRadius: 6, flexShrink: 0,
        background: "rgba(243,237,225,.06)",
        border: "1px solid rgba(243,237,225,.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        fontWeight: 600,
        color: "var(--muted-foreground)",
        letterSpacing: "0.05em",
      }}
    >
      {initials}
    </div>
  )
}

export function RecentActivity() {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 8px rgba(0,0,0,.06)",
      }}
    >
      {/* Header */}
      <div className="flex items-baseline gap-3 mb-5">
        <h2 className="font-display text-[1.4rem] font-light italic text-foreground">
          The Ledger
        </h2>
        <div
          className="flex-1 h-px"
          style={{ background: "linear-gradient(90deg, rgba(227,176,75,.22), transparent)" }}
        />
        <a
          href="/activity"
          className="font-mono text-[9px] uppercase tracking-[0.2em] cursor-pointer hover:opacity-70 transition-opacity"
          style={{ color: "rgba(227,176,75,.60)" }}
        >
          View all →
        </a>
      </div>

      {/* Column headers */}
      <div
        className="grid gap-3 py-2 mb-1"
        style={{ gridTemplateColumns: "3.5rem 1fr 1fr 4rem", borderBottom: "1px solid var(--border)" }}
      >
        {["Time", "Member", "Action", "Role"].map((h) => (
          <span key={h} className="font-mono text-[8px] uppercase tracking-[0.25em] text-muted-foreground">
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {activities.map((a, i) => {
        const rc = roleConfig[a.role] ?? { color: "var(--muted-foreground)", dot: "var(--muted-foreground)" }
        return (
          <div
            key={a.id}
            className={`grid gap-3 py-3 items-center rise rise-${Math.min(i + 7, 12)}`}
            style={{ gridTemplateColumns: "3.5rem 1fr 1fr 4rem", borderBottom: "1px solid var(--border)" }}
          >
            <span className="font-mono text-[10px] leading-none text-muted-foreground">
              {a.time}
            </span>
            <div className="flex items-center gap-2 min-w-0">
              <AvatarInitials initials={a.user.initials} />
              <span className="text-[12px] font-medium leading-none truncate text-foreground">
                {a.user.name}
              </span>
            </div>
            <span className="text-[11px] leading-none truncate text-muted-foreground">
              {a.action}
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ background: rc.dot, boxShadow: `0 0 4px ${rc.dot}80` }}
              />
              <span
                className="font-mono text-[9px] font-semibold uppercase tracking-wider"
                style={{ color: rc.color }}
              >
                {a.role}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
