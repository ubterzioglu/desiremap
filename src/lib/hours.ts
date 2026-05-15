// Day keys match the API contract: { "mo": "18:00-06:00", "tu": "closed", ... }
const DAY_KEYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'] as const

function parseRange(range: string): [number, number] | null {
  const match = range.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/)
  if (!match) return null

  const [, startHour, startMinute, endHour, endMinute] = match
  if (!startHour || !startMinute || !endHour || !endMinute) return null

  return [
    parseInt(startHour, 10) * 60 + parseInt(startMinute, 10),
    parseInt(endHour, 10) * 60 + parseInt(endMinute, 10),
  ]
}

export function isOpenNow(openingHours: Record<string, string> | null | undefined): boolean {
  if (!openingHours || Object.keys(openingHours).length === 0) return false

  const now = new Date()
  const cur = now.getHours() * 60 + now.getMinutes()
  const todayKey = DAY_KEYS[now.getDay()]
  const yesterdayKey = DAY_KEYS[(now.getDay() + 6) % 7]
  if (!todayKey || !yesterdayKey) return false

  const todayRange = parseRange(openingHours[todayKey] ?? '')
  if (todayRange) {
    const [start, end] = todayRange
    if (end > start) {
      if (cur >= start && cur < end) return true
    } else {
      // Overnight range (e.g. 22:00-04:00): open from start until midnight
      if (cur >= start) return true
    }
  }

  // Yesterday's overnight range may still cover early morning hours
  const yesterdayRange = parseRange(openingHours[yesterdayKey] ?? '')
  if (yesterdayRange) {
    const [start, end] = yesterdayRange
    if (end <= start && cur < end) return true
  }

  return false
}
