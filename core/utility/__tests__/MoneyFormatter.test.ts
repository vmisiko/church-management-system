import { describe, it, expect } from 'vitest'
import { MoneyFormatter } from '../MoneyFormatter'

describe('MoneyFormatter', () => {
  describe('format', () => {
    it('should format amount with default currency (KES) and locale (en-US)', () => {
      expect(MoneyFormatter.format(1234.56)).toBe('KES 1,234.56')
    })

    it('should format amount with custom currency', () => {
      expect(MoneyFormatter.format(1234.56, 'USD')).toBe('USD 1,234.56')
      expect(MoneyFormatter.format(1234.56, 'EUR')).toBe('EUR 1,234.56')
    })

    it('should format amount with custom locale', () => {
      expect(MoneyFormatter.format(1234.56, 'KES', 'fr-FR')).toBe('KES 1\u202f234,56')
      expect(MoneyFormatter.format(1234.56, 'KES', 'de-DE')).toBe('KES 1.234,56')
    })

    it('should handle zero amount', () => {
      expect(MoneyFormatter.format(0)).toBe('KES 0.00')
    })

    it('should handle negative amount', () => {
      expect(MoneyFormatter.format(-1234.56)).toBe('KES -1,234.56')
    })

    it('should handle large numbers', () => {
      expect(MoneyFormatter.format(1234567.89)).toBe('KES 1,234,567.89')
    })

    it('should handle small decimal numbers', () => {
      expect(MoneyFormatter.format(0.01)).toBe('KES 0.01')
    })
  })

  describe('formatWithoutCurrency', () => {
    it('should format amount without currency symbol', () => {
      expect(MoneyFormatter.formatWithoutCurrency(1234.56)).toBe('1,234.56')
    })

    it('should format amount with custom locale', () => {
      expect(MoneyFormatter.formatWithoutCurrency(1234.56, 'fr-FR')).toBe('1\u202f234,56')
      expect(MoneyFormatter.formatWithoutCurrency(1234.56, 'de-DE')).toBe('1.234,56')
    })

    it('should handle zero amount', () => {
      expect(MoneyFormatter.formatWithoutCurrency(0)).toBe('0.00')
    })

    it('should handle negative amount', () => {
      expect(MoneyFormatter.formatWithoutCurrency(-1234.56)).toBe('-1,234.56')
    })

    it('should handle large numbers', () => {
      expect(MoneyFormatter.formatWithoutCurrency(1234567.89)).toBe('1,234,567.89')
    })

    it('should handle small decimal numbers', () => {
      expect(MoneyFormatter.formatWithoutCurrency(0.01)).toBe('0.01')
    })
  })

  describe('formatNumber', () => {
    it('should format number without decimal places', () => {
      expect(MoneyFormatter.formatNumber(1234)).toBe('1,234')
    })

    it('should format number with custom locale', () => {
      expect(MoneyFormatter.formatNumber(1234, 'fr-FR')).toBe('1\u202f234')
      expect(MoneyFormatter.formatNumber(1234, 'de-DE')).toBe('1.234')
    })

    it('should handle zero', () => {
      expect(MoneyFormatter.formatNumber(0)).toBe('0')
    })

    it('should handle negative numbers', () => {
      expect(MoneyFormatter.formatNumber(-1234)).toBe('-1,234')
    })

    it('should handle large numbers', () => {
      expect(MoneyFormatter.formatNumber(1234567)).toBe('1,234,567')
    })

    it('should handle decimal numbers (rounding to integer)', () => {
      expect(MoneyFormatter.formatNumber(1234.56)).toBe('1,235')
      expect(MoneyFormatter.formatNumber(1234.4)).toBe('1,234')
    })
  })
})
