import { describe, it, expect } from 'vitest'
import type { RetentionStats } from '@/domain/entities/retention/Retention'
import {
  buildRetentionCsvRows,
  buildRetentionSummaryTable,
  buildRetentionBreakdownTable,
  retentionExportFilename,
} from '../retentionExportRows'

const stats: RetentionStats = {
  cohortRetention: {
    d30: { eligible: 148, retained: 48, rate: 32.4 },
    d60: { eligible: 121, retained: 44, rate: 36.4 },
    d90: { eligible: 101, retained: 41, rate: 40.6 },
  },
  guestConversion: { total: 148, converted: 134, rate: 90.5, note: '' },
  followUpCompletion: { total: 41, completed: 19, rate: 46.3 },
  trend: [],
  departmentBreakdown: [{ id: 'd1', name: 'Ushering', memberCount: 20, activeCount: 15 }],
  fellowshipBreakdown: [{ id: 'f1', name: 'Zone A', memberCount: 10, activeCount: 0 }],
}

describe('buildRetentionCsvRows', () => {
  it('builds the 5 summary rows plus one row per department and fellowship', () => {
    const rows = buildRetentionCsvRows(stats)

    expect(rows).toHaveLength(7)
    expect(rows[0]).toEqual({ metric: '30-day retention', eligible: 148, value: 48, ratePct: 32.4 })
    expect(rows[4]).toEqual({ metric: 'Follow-up completion', eligible: 41, value: 19, ratePct: 46.3 })
  })

  it('computes the breakdown rate from memberCount/activeCount, rounded to 1 decimal', () => {
    const rows = buildRetentionCsvRows(stats)

    expect(rows[5]).toEqual({ metric: 'Department: Ushering', eligible: 20, value: 15, ratePct: 75 })
  })

  it('returns 0% rather than dividing by zero when memberCount is 0', () => {
    const zeroMemberStats: RetentionStats = {
      ...stats,
      departmentBreakdown: [{ id: 'd2', name: 'Empty Dept', memberCount: 0, activeCount: 0 }],
      fellowshipBreakdown: [],
    }

    const rows = buildRetentionCsvRows(zeroMemberStats)

    expect(rows[5]).toEqual({ metric: 'Department: Empty Dept', eligible: 0, value: 0, ratePct: 0 })
  })

  it('omits breakdown rows entirely when none are present', () => {
    const noBreakdown: RetentionStats = { ...stats, departmentBreakdown: undefined, fellowshipBreakdown: undefined }

    expect(buildRetentionCsvRows(noBreakdown)).toHaveLength(5)
  })
})

describe('buildRetentionSummaryTable', () => {
  it('formats each metric as a 4-column string row with a % rate', () => {
    const table = buildRetentionSummaryTable(stats)

    expect(table).toHaveLength(5)
    expect(table[0]).toEqual(['30-day retention', '148', '48', '32.4%'])
  })
})

describe('buildRetentionBreakdownTable', () => {
  it('concatenates department and fellowship breakdowns into one table', () => {
    const table = buildRetentionBreakdownTable(stats)

    expect(table).toEqual([
      ['Ushering', '20', '15'],
      ['Zone A', '10', '0'],
    ])
  })

  it('returns an empty array when there is no breakdown data', () => {
    const noBreakdown: RetentionStats = { ...stats, departmentBreakdown: undefined, fellowshipBreakdown: undefined }

    expect(buildRetentionBreakdownTable(noBreakdown)).toEqual([])
  })
})

describe('retentionExportFilename', () => {
  it('uses the given date range', () => {
    expect(retentionExportFilename('csv', '2026-01-01', '2026-06-30')).toBe(
      'retention-report-2026-01-01-to-2026-06-30.csv',
    )
  })

  it('falls back to "all" and "now" when dates are empty', () => {
    expect(retentionExportFilename('pdf', '', '')).toBe('retention-report-all-to-now.pdf')
  })
})
