import type { RetentionStats } from "@/domain/entities/retention/Retention"

export interface RetentionCsvRow {
  metric: string
  eligible: number
  value: number
  ratePct: number
}

function breakdownRate(memberCount: number, activeCount: number): number {
  return memberCount > 0 ? Math.round((activeCount / memberCount) * 1000) / 10 : 0
}

/** Pure row-building logic shared by the CSV and PDF exports on the retention page. */
export function buildRetentionCsvRows(stats: RetentionStats): RetentionCsvRow[] {
  return [
    { metric: "30-day retention", eligible: stats.cohortRetention.d30.eligible, value: stats.cohortRetention.d30.retained, ratePct: stats.cohortRetention.d30.rate },
    { metric: "60-day retention", eligible: stats.cohortRetention.d60.eligible, value: stats.cohortRetention.d60.retained, ratePct: stats.cohortRetention.d60.rate },
    { metric: "90-day retention", eligible: stats.cohortRetention.d90.eligible, value: stats.cohortRetention.d90.retained, ratePct: stats.cohortRetention.d90.rate },
    { metric: "Guest conversion", eligible: stats.guestConversion.total, value: stats.guestConversion.converted, ratePct: stats.guestConversion.rate },
    { metric: "Follow-up completion", eligible: stats.followUpCompletion.total, value: stats.followUpCompletion.completed, ratePct: stats.followUpCompletion.rate },
    ...(stats.departmentBreakdown ?? []).map((d) => ({ metric: `Department: ${d.name}`, eligible: d.memberCount, value: d.activeCount, ratePct: breakdownRate(d.memberCount, d.activeCount) })),
    ...(stats.fellowshipBreakdown ?? []).map((f) => ({ metric: `Fellowship: ${f.name}`, eligible: f.memberCount, value: f.activeCount, ratePct: breakdownRate(f.memberCount, f.activeCount) })),
  ]
}

export function buildRetentionSummaryTable(stats: RetentionStats): string[][] {
  return [
    ["30-day retention", String(stats.cohortRetention.d30.eligible), String(stats.cohortRetention.d30.retained), `${stats.cohortRetention.d30.rate}%`],
    ["60-day retention", String(stats.cohortRetention.d60.eligible), String(stats.cohortRetention.d60.retained), `${stats.cohortRetention.d60.rate}%`],
    ["90-day retention", String(stats.cohortRetention.d90.eligible), String(stats.cohortRetention.d90.retained), `${stats.cohortRetention.d90.rate}%`],
    ["Guest conversion", String(stats.guestConversion.total), String(stats.guestConversion.converted), `${stats.guestConversion.rate}%`],
    ["Follow-up completion", String(stats.followUpCompletion.total), String(stats.followUpCompletion.completed), `${stats.followUpCompletion.rate}%`],
  ]
}

export function buildRetentionBreakdownTable(stats: RetentionStats): string[][] {
  const breakdown = [...(stats.departmentBreakdown ?? []), ...(stats.fellowshipBreakdown ?? [])]
  return breakdown.map((row) => [row.name, String(row.memberCount), String(row.activeCount)])
}

export function retentionExportFilename(kind: "csv" | "pdf", from: string, to: string): string {
  return `retention-report-${from || "all"}-to-${to || "now"}.${kind}`
}
