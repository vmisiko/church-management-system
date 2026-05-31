export class MoneyFormatter {
  constructor() {}

  /**
   * Formats a number as currency.
   * @param amount - The amount to be formatted.
   * @param currency - The currency code (e.g., 'USD', 'EUR', 'KES').
   * @param locale - The locale for formatting (default is 'en-US').
   * @returns Formatted currency string.
   */
  static format(amount: number, currency: string = 'KES', locale: string = 'en-US'): string {
    const formattedNumber = Number(amount.toFixed(2)).toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return `${currency} ${formattedNumber}`
  }

  static formatWithoutCurrency(amount: number, locale: string = 'en-US'): string {
    return Number(amount.toFixed(2)).toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  static formatNumber(amount: number, locale: string = 'en-US'): string {
    return Math.round(amount).toLocaleString(locale)
  }
}
