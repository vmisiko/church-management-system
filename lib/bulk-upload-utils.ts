export interface ParsedMemberRow {
  rowIndex: number
  fullName: string
  phone: string
  normalizedPhone: string | null
  email: string
  gender: string
  ageGroup: string
  area: string
  churchRole: string
  wantsUpdates: boolean
  isOnline: boolean
  isInternational: boolean
  fellowshipId: string | null
  fellowshipName: string | null
  status: 'ready' | 'duplicate_in_file' | 'invalid'
  issues: string[]
}

const FELLOWSHIP_KEYWORDS: Array<{ keywords: string[]; slug: string; name: string }> = [
  { keywords: ['kawangware'], slug: 'kawangware-fellowship', name: 'Kawangware Fellowship' },
  { keywords: ['utawala', 'mihango'], slug: 'utawala-fellowship', name: 'Utawala Fellowship' },
  { keywords: ['embakasi'], slug: 'embakasi-fellowship', name: 'Embakasi Fellowship' },
  { keywords: ['kasarani'], slug: 'kasarani-fellowship', name: 'Kasarani Fellowship' },
  { keywords: ['roysambu'], slug: 'roysambu-fellowship', name: 'Roysambu Fellowship' },
  { keywords: ['ngong'], slug: 'ngong-fellowship', name: 'Ngong Fellowship' },
  { keywords: ['thika'], slug: 'thika-fellowship', name: 'Thika Fellowship' },
  { keywords: ['ruaka', 'banana'], slug: 'ruaka-fellowship', name: 'Ruaka Fellowship' },
  { keywords: ["ng'ando", 'ngando', 'ng ando'], slug: 'ngando-fellowship', name: "Ng'ando Fellowship" },
  { keywords: ["lang'ata", 'langata', 'lang ata'], slug: 'langata-fellowship', name: "Lang'ata Fellowship" },
]

// Use word-boundary patterns for short keywords to avoid matching substrings of Kenyan area names
// (e.g. 'uk' in 'Mukuru', 'usa' in 'Musa')
const INTERNATIONAL_AREA_PATTERNS: RegExp[] = [
  /\btanzania\b/, /\buganda\b/, /\brwanda\b/, /\bdubai\b/,
  /\buk\b/, /\busa\b/, /\bcanada\b/, /\baustralia\b/,
  /\bgermany\b/, /\bnetherlands\b/, /\bbahrain\b/, /\bqatar\b/,
  /\bkuwait\b/, /\boman\b/, /\bsaudi\b/, /\blebanon\b/,
  /\barusha\b/, /\bkampala\b/, /dar es salaam/,
]

export function normalizePhone(raw: string): string | null {
  if (!raw?.trim()) return null
  const original = raw.trim()
  const cleaned = original.replace(/[\s\-().]/g, '')
  if (!cleaned || cleaned.length < 7) return null
  if (cleaned.startsWith('+254')) return cleaned
  if (cleaned.startsWith('+')) return cleaned  // other international
  if (cleaned.startsWith('254') && cleaned.length >= 12) return '+' + cleaned
  if ((cleaned.startsWith('07') || cleaned.startsWith('01')) && cleaned.length === 10)
    return '+254' + cleaned.slice(1)
  if (/^\d{9}$/.test(cleaned)) return '+254' + cleaned
  // Only keep as-is if it looks like a valid phone number (digits only, reasonable length)
  return /^\d{7,15}$/.test(cleaned) ? original : null
}

export function matchFellowship(
  area: string,
  fellowshipIdMap?: Map<string, string>,
): { id: string; name: string } | null {
  if (!area?.trim()) return null
  const lower = area.toLowerCase()
  for (const f of FELLOWSHIP_KEYWORDS) {
    if (f.keywords.some((kw) => lower.includes(kw))) {
      const resolvedId = fellowshipIdMap?.get(f.name) ?? f.slug
      return { id: resolvedId, name: f.name }
    }
  }
  return null
}

export function isInternationalArea(area: string): boolean {
  if (!area?.trim()) return false
  const lower = area.toLowerCase()
  return INTERNATIONAL_AREA_PATTERNS.some((re) => re.test(lower))
}

export function mapChurchRole(raw: string): string {
  const lower = raw?.toLowerCase()?.trim() ?? ''
  if (lower.includes('online')) return 'online_member'
  if (lower.includes('pastor')) return 'pastor'
  if (lower.includes('elder')) return 'elder'
  if (lower.includes('overseer')) return 'overseer'
  if (lower.includes('first-time') || lower.includes('first time') || lower.includes('visitor'))
    return 'first_time_visitor'
  if (lower.includes('regular')) return 'regular_attendee'
  return 'church_member'
}

export function mapAgeGroup(raw: string): string {
  const lower = raw?.toLowerCase()?.trim() ?? ''
  if (lower.includes('under') || (lower.includes('18') && lower.includes('under'))) return 'under_18'
  if (lower.includes('18') && lower.includes('25')) return '18_25'
  if (lower.includes('26') && lower.includes('35')) return '26_35'
  if (lower.includes('36') && lower.includes('50')) return '36_50'
  if (lower.includes('above') || lower.includes('50+')) return 'above_50'
  return ''
}

export function mapGender(raw: string): string {
  const lower = raw?.toLowerCase()?.trim() ?? ''
  if (lower === 'male' || lower === 'm') return 'male'
  if (lower === 'female' || lower === 'f') return 'female'
  return ''
}

export function processRawRows(
  rawRows: Record<string, string>[],
  fellowshipIdMap?: Map<string, string>,
): ParsedMemberRow[] {
  const seenPhones = new Map<string, number>()
  const seenEmails = new Map<string, number>()

  return rawRows.map((raw, i) => {
    const rowIndex = i + 1
    const fullName = (raw['Full Name'] ?? raw['fullName'] ?? '').trim()
    const phone = (raw['Mobile Phone Number'] ?? raw['phone'] ?? '').trim()
    const email = (raw['Email Address'] ?? raw['email'] ?? '').trim()
    const gender = mapGender(raw['Gender'] ?? raw['gender'] ?? '')
    const ageGroupRaw = raw['Age Group'] ?? raw['ageGroup'] ?? ''
    const ageGroup = mapAgeGroup(ageGroupRaw)
    const area = (raw['Area of Residence'] ?? raw['areaOfResidence'] ?? '').trim()
    const churchRoleRaw = raw['Are you'] ?? raw['churchRole'] ?? 'Church Member'
    const churchRole = mapChurchRole(churchRoleRaw)
    const wantsRaw = (raw['Would you like to receive church updates and announcements via SMS or WhatsApp?'] ?? 'YES').toUpperCase()
    const wantsUpdates = wantsRaw === 'YES'

    const normalizedPhone = normalizePhone(phone)
    const fellowshipMatch = matchFellowship(area, fellowshipIdMap)
    const intlArea = isInternationalArea(area)
    const isOnline = churchRole === 'online_member' || intlArea
    const isInternational =
      isOnline && (!normalizedPhone || !normalizedPhone.startsWith('+254'))
    const emailKey = email.toLowerCase()

    const issues: string[] = []
    if (!fullName) issues.push('Missing name')
    if (!normalizedPhone && !email) issues.push('No phone or email')

    let status: 'ready' | 'duplicate_in_file' | 'invalid' = 'ready'

    if (!fullName) {
      status = 'invalid'
    } else if (normalizedPhone && seenPhones.has(normalizedPhone)) {
      status = 'duplicate_in_file'
      issues.push(`Duplicate of row ${seenPhones.get(normalizedPhone)}`)
    } else if (emailKey && seenEmails.has(emailKey)) {
      status = 'duplicate_in_file'
      issues.push(`Duplicate email — same as row ${seenEmails.get(emailKey)}`)
    }

    if (status !== 'duplicate_in_file') {
      if (normalizedPhone) seenPhones.set(normalizedPhone, rowIndex)
      if (emailKey) seenEmails.set(emailKey, rowIndex)
    }

    return {
      rowIndex,
      fullName,
      phone,
      normalizedPhone,
      email,
      gender,
      ageGroup,
      area,
      churchRole,
      wantsUpdates,
      isOnline,
      isInternational,
      fellowshipId: fellowshipMatch?.id ?? null,
      fellowshipName: fellowshipMatch?.name ?? null,
      status,
      issues,
    }
  })
}

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
