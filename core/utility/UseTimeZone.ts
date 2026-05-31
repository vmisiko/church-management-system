import moment from 'moment'

const useTimeZone = () => {
  const formatUTCTime = (date: Date | number | string) => {
    const localTime = moment.utc(date).local().format()
    const formated = moment(localTime).format('Do MMM YYYY, h:mm:ss a')
    return formated
  }

  const formatDayMonthYear = (date?: Date | number | string) => {
    if (!date) {
      return '--'
    }

    let localTime

    // Try to parse as UTC if possible
    if (moment.utc(date, moment.ISO_8601, true).isValid()) {
      localTime = moment.utc(date).local()
    } else if (moment(date, 'DD-MM-YYYY', true).isValid()) {
      // Handle explicitly formatted strings like '31-12-2023'
      localTime = moment(date, 'DD-MM-YYYY')
    } else {
      // Fallback to parsing as a general string
      localTime = moment(date)
    }

    // Check if the final parsed date is valid
    if (!localTime.isValid()) {
      return '--'
    }

    // Format to desired output
    return localTime.format('Do MMM YYYY')
  }

  const formatDate = (timestamp: Date | number | string) => {
    const localTime = moment.utc(timestamp).local()
    return localTime.format('ddd, DD MMMM YYYY HH:mm A')
  }

  const formatDateOnly = (timestamp: Date | number | string) => {
    const localTime = moment.utc(timestamp).local()
    return localTime.format('DD/MM/YYYY')
  }

  const formatTimeOnly = (timestamp: Date | number | string) => {
    const localTime = moment.utc(timestamp).local()
    return localTime.format('HH:mm A')
  }
  // Merchant Statement - Development work KE - 2025-Jul-08_03.56AM
  const formatFilename = (timestamp: Date | number | string) => {
    const localTime = moment.utc(timestamp).local()
    return `${localTime.format('YYYY-MM-DD_HH.mmAM')}.xlsx`
  }

  const formatDayLongMonthYear = (timestamp: Date | number | string) => {
    const localTime = moment.utc(timestamp).local()
    return localTime.format('DD-MMM-YYYY')
  }

  return {
    formatUTCTime,
    formatDayMonthYear,
    formatDate,
    formatTimeOnly,
    formatDateOnly,
    formatFilename,
    formatDayLongMonthYear,
  }
}

export default useTimeZone
