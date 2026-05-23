export interface FellowshipRecord {
  id: string
  name: string
  zone: string
  leader: string
  members: number
  meetingDay: string
  meetingTime: string
  location: string
  status: "active" | "inactive"
  description: string
}

export function getFellowshipBySlug(slug: string): FellowshipRecord | undefined {
  return mockFellowships.find((fellowship) => fellowshipSlug(fellowship.name) === slug)
}

export const FELLOWSHIP_NAMES = [
  "Kawangware Fellowship",
  "Roysambu Fellowship",
  "Utawala Fellowship",
  "Ngong Fellowship",
  "Ng'ando Fellowship",
  "Lang'ata Fellowship",
  "Thika Fellowship",
  "Ruaka Fellowship",
  "Kasarani Fellowship",
  "Embakasi Fellowship",
] as const

export type FellowshipName = (typeof FELLOWSHIP_NAMES)[number]

export const FELLOWSHIP_ZONES = [
  "Waiyaki Way Zone",
  "Thika Road Zone",
  "Southern Bypass Zone",
  "Mombasa Road Zone",
  "Lang'ata Road Zone",
  "Outer Ring Road Zone",
] as const

export type FellowshipZone = (typeof FELLOWSHIP_ZONES)[number]

export const fellowshipZoneOptions = FELLOWSHIP_ZONES.map((zone) => ({
  value: zone,
  label: zone,
}))

export const fellowshipZoneColors: Record<string, string> = {
  "Waiyaki Way Zone": "bg-primary text-primary-foreground",
  "Thika Road Zone": "bg-accent text-accent-foreground",
  "Southern Bypass Zone": "bg-chart-3 text-white",
  "Mombasa Road Zone": "bg-chart-4 text-white",
  "Lang'ata Road Zone": "bg-chart-5 text-white",
  "Outer Ring Road Zone": "bg-secondary text-secondary-foreground",
}

export function fellowshipSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/\s+/g, "-")
}

export function meetingDayToFormValue(day: string): string {
  return day.toLowerCase()
}

export function meetingTimeToFormValue(time: string): string {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return time

  let hours = parseInt(match[1], 10)
  const minutes = match[2]
  const period = match[3].toUpperCase()

  if (period === "PM" && hours !== 12) hours += 12
  if (period === "AM" && hours === 12) hours = 0

  return `${hours.toString().padStart(2, "0")}:${minutes}`
}

export function fellowshipToFormData(fellowship: FellowshipRecord) {
  return {
    name: fellowship.name,
    zone: fellowship.zone,
    leader: fellowship.leader,
    meetingDay: meetingDayToFormValue(fellowship.meetingDay),
    meetingTime: meetingTimeToFormValue(fellowship.meetingTime),
    location: fellowship.location,
    description: fellowship.description,
    status: fellowship.status,
  }
}

export const fellowshipFilterOptions = [
  { value: "all", label: "All Fellowships" },
  ...FELLOWSHIP_NAMES.map((name) => ({ value: name, label: name })),
]

export const fellowshipSelectOptions = FELLOWSHIP_NAMES.map((name) => ({
  value: fellowshipSlug(name),
  label: name,
}))

export const mockFellowships: FellowshipRecord[] = [
  {
    id: "1",
    name: "Kawangware Fellowship",
    zone: "Waiyaki Way Zone",
    leader: "Pastor James Okoro",
    members: 156,
    meetingDay: "Wednesday",
    meetingTime: "6:00 PM",
    location: "Kawangware 46, Nairobi",
    status: "active",
    description:
      "A vibrant home fellowship serving the Kawangware community with weekly Bible study, prayer, and fellowship meals.",
  },
  {
    id: "2",
    name: "Roysambu Fellowship",
    zone: "Thika Road Zone",
    leader: "Deacon Mary Adewale",
    members: 98,
    meetingDay: "Thursday",
    meetingTime: "5:30 PM",
    location: "Roysambu, Nairobi",
    status: "active",
    description:
      "Growing fellowship along Thika Road focused on discipleship and community outreach in Roysambu.",
  },
  {
    id: "3",
    name: "Utawala Fellowship",
    zone: "Mombasa Road Zone",
    leader: "Elder Samuel Nwosu",
    members: 134,
    meetingDay: "Tuesday",
    meetingTime: "6:30 PM",
    location: "Utawala Estate, Nairobi",
    status: "active",
    description:
      "Home group meeting in Utawala Estate with emphasis on family ministry and intercessory prayer.",
  },
  {
    id: "4",
    name: "Ngong Fellowship",
    zone: "Southern Bypass Zone",
    leader: "Pastor Ruth Eze",
    members: 87,
    meetingDay: "Friday",
    meetingTime: "5:00 PM",
    location: "Ngong Town, Kajiado",
    status: "active",
    description:
      "Southern Bypass zone fellowship reaching Ngong Town with worship, teaching, and youth engagement.",
  },
  {
    id: "5",
    name: "Ng'ando Fellowship",
    zone: "Waiyaki Way Zone",
    leader: "Deacon Peter Obi",
    members: 112,
    meetingDay: "Wednesday",
    meetingTime: "7:00 PM",
    location: "Ng'ando, Nairobi",
    status: "active",
    description:
      "Mid-week gathering in Ng'ando for Bible study, accountability, and neighborhood evangelism.",
  },
  {
    id: "6",
    name: "Lang'ata Fellowship",
    zone: "Lang'ata Road Zone",
    leader: "Minister David Chukwu",
    members: 145,
    meetingDay: "Saturday",
    meetingTime: "4:00 PM",
    location: "Lang'ata, Nairobi",
    status: "active",
    description:
      "One of the oldest fellowships, serving Lang'ata with strong community ties and pastoral care.",
  },
  {
    id: "7",
    name: "Thika Fellowship",
    zone: "Thika Road Zone",
    leader: "Pastor Grace Mwangi",
    members: 121,
    meetingDay: "Sunday",
    meetingTime: "3:00 PM",
    location: "Thika Town, Kiambu",
    status: "active",
    description:
      "Sunday afternoon fellowship in Thika Town connecting members across Kiambu County.",
  },
  {
    id: "8",
    name: "Ruaka Fellowship",
    zone: "Waiyaki Way Zone",
    leader: "Elder John Kamau",
    members: 103,
    meetingDay: "Thursday",
    meetingTime: "6:00 PM",
    location: "Ruaka, Nairobi",
    status: "active",
    description:
      "Waiyaki Way zone group in Ruaka with a focus on worship and member care.",
  },
  {
    id: "9",
    name: "Kasarani Fellowship",
    zone: "Thika Road Zone",
    leader: "Deacon Faith Njeri",
    members: 118,
    meetingDay: "Friday",
    meetingTime: "5:30 PM",
    location: "Kasarani, Nairobi",
    status: "active",
    description:
      "Thika Road zone fellowship in Kasarani with active choir and prayer ministry.",
  },
  {
    id: "10",
    name: "Embakasi Fellowship",
    zone: "Outer Ring Road Zone",
    leader: "Pastor Daniel Ochieng",
    members: 132,
    meetingDay: "Wednesday",
    meetingTime: "6:30 PM",
    location: "Embakasi, Nairobi",
    status: "active",
    description:
      "Outer Ring Road zone fellowship serving Embakasi with youth-led outreach and home visits.",
  },
]
