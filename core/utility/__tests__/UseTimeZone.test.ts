import { describe, it, expect } from 'vitest'
import useTimeZone from '../UseTimeZone'
import moment from 'moment'

describe('useTimeZone', () => {
  const { formatUTCTime, formatDayMonthYear, formatDate, formatDateOnly, formatTimeOnly } =
    useTimeZone()

  describe('formatUTCTime', () => {
    it('should format UTC date correctly', () => {
      const utcDate = '2024-03-15T10:30:00Z'
      const result = formatUTCTime(utcDate)
      const expected = moment.utc(utcDate).local().format('Do MMM YYYY, h:mm:ss a')
      expect(result).toBe(expected)
    })

    it('should handle Date object input', () => {
      const date = new Date('2024-03-15T10:30:00Z')
      const result = formatUTCTime(date)
      const expected = moment.utc(date).local().format('Do MMM YYYY, h:mm:ss a')
      expect(result).toBe(expected)
    })

    it('should handle timestamp input', () => {
      const timestamp = 1710498600000 // 2024-03-15T10:30:00Z
      const result = formatUTCTime(timestamp)
      const expected = moment.utc(timestamp).local().format('Do MMM YYYY, h:mm:ss a')
      expect(result).toBe(expected)
    })
  })

  describe('formatDayMonthYear', () => {
    it('should format UTC date correctly', () => {
      const utcDate = '2024-03-15T10:30:00Z'
      const result = formatDayMonthYear(utcDate)
      const expected = moment.utc(utcDate).local().format('Do MMM YYYY')
      expect(result).toBe(expected)
    })

    it('should handle DD-MM-YYYY format', () => {
      const date = '15-03-2024'
      const result = formatDayMonthYear(date)
      const expected = moment(date, 'DD-MM-YYYY').format('Do MMM YYYY')
      expect(result).toBe(expected)
    })

    it('should return -- for invalid date', () => {
      const invalidDate = 'invalid-date'
      const result = formatDayMonthYear(invalidDate)
      expect(result).toBe('--')
    })

    it('should return -- for undefined input', () => {
      const result = formatDayMonthYear(undefined)
      expect(result).toBe('--')
    })

    it('should handle Date object input', () => {
      const date = new Date('2024-03-15T10:30:00Z')
      const result = formatDayMonthYear(date)
      const expected = moment.utc(date).local().format('Do MMM YYYY')
      expect(result).toBe(expected)
    })
  })

  describe('formatDate', () => {
    it('should format UTC date correctly', () => {
      const utcDate = '2024-03-15T10:30:00Z'
      const result = formatDate(utcDate)
      const expected = moment.utc(utcDate).local().format('ddd, DD MMMM YYYY HH:mm A')
      expect(result).toBe(expected)
    })

    it('should handle Date object input', () => {
      const date = new Date('2024-03-15T10:30:00Z')
      const result = formatDate(date)
      const expected = moment.utc(date).local().format('ddd, DD MMMM YYYY HH:mm A')
      expect(result).toBe(expected)
    })

    it('should handle timestamp input', () => {
      const timestamp = 1710498600000 // 2024-03-15T10:30:00Z
      const result = formatDate(timestamp)
      const expected = moment.utc(timestamp).local().format('ddd, DD MMMM YYYY HH:mm A')
      expect(result).toBe(expected)
    })
  })

  describe('formatDateOnly', () => {
    it('should format UTC date correctly', () => {
      const utcDate = '2024-03-15T10:30:00Z'
      const result = formatDateOnly(utcDate)
      const expected = moment.utc(utcDate).local().format('DD/MM/YYYY')
      expect(result).toBe(expected)
    })

    it('should handle Date object input', () => {
      const date = new Date('2024-03-15T10:30:00Z')
      const result = formatDateOnly(date)
      const expected = moment.utc(date).local().format('DD/MM/YYYY')
      expect(result).toBe(expected)
    })

    it('should handle timestamp input', () => {
      const timestamp = 1710498600000 // 2024-03-15T10:30:00Z
      const result = formatDateOnly(timestamp)
      const expected = moment.utc(timestamp).local().format('DD/MM/YYYY')
      expect(result).toBe(expected)
    })
  })

  describe('formatTimeOnly', () => {
    it('should format UTC time correctly', () => {
      const utcDate = '2024-03-15T10:30:00Z'
      const result = formatTimeOnly(utcDate)
      const expected = moment.utc(utcDate).local().format('HH:mm A')
      expect(result).toBe(expected)
    })

    it('should handle Date object input', () => {
      const date = new Date('2024-03-15T10:30:00Z')
      const result = formatTimeOnly(date)
      const expected = moment.utc(date).local().format('HH:mm A')
      expect(result).toBe(expected)
    })

    it('should handle timestamp input', () => {
      const timestamp = 1710498600000 // 2024-03-15T10:30:00Z
      const result = formatTimeOnly(timestamp)
      const expected = moment.utc(timestamp).local().format('HH:mm A')
      expect(result).toBe(expected)
    })
  })
})
