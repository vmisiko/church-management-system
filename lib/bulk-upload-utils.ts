import type { BulkPreviewRow } from '@/domain/entities/member/Member'

/**
 * ParsedMemberRow is an alias for BulkPreviewRow — the backend now returns
 * the same shape that was previously computed in the browser.
 */
export type ParsedMemberRow = BulkPreviewRow

export function generateCsvTemplate(): string {
  const headers = [
    'Full Name',
    'Mobile Phone Number',
    'Gender',
    'Email Address',
    'Age Group',
    'Area of Residence',
    'Are you',
    'Would you like to receive church updates and announcements via SMS or WhatsApp?',
  ]
  const example1 = ['John Kamau', '0712345678', 'Male', 'john@example.com', '26 - 35', 'Kawangware', 'Church Member', 'YES']
  const example2 = ['Jane Wangari', '+254700123456', 'Female', 'jane@example.com', '18 - 25', 'Roysambu', 'Regular Attendee', 'NO']
  return [headers, example1, example2].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
}
