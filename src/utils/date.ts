// "YYYY-MM-DD" metnini yerel saatle Date'e çevirir
export function parseDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Date nesnesini "YYYY-MM-DD" metnine çevirir (yerel saate göre)
function toISODate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

// Bugünün tarihi ("YYYY-MM-DD")
export function todayISO(): string {
  return toISODate(new Date())
}

// Bir tarihin ait olduğu ay: "2026-11-13" → "2026-11"
export function getMonthKey(date: string): string {
  return date.slice(0, 7)
}

// İçinde bulunduğumuz ay, ör. "2026-11"
export function getCurrentMonthKey(): string {
  return getMonthKey(todayISO())
}

// Ayı ileri/geri kaydırır: shiftMonth("2026-01", -1) → "2025-12"
export function shiftMonth(monthKey: string, delta: number): string {
  const [year, month] = monthKey.split('-').map(Number)
  return toISODate(new Date(year, month - 1 + delta, 1)).slice(0, 7)
}

// Ay değeri geçerli mi?
export function isValidMonthKey(value: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value)
}

// Haftanın günü: Pazartesi = 0 ... Pazar = 6
export function getWeekdayIndex(date: string): number {
  return (parseDate(date).getDay() + 6) % 7
}
