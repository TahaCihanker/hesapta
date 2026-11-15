import { parseDate } from './date'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
})

const roundedCurrencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
})

const percentFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'percent',
  maximumFractionDigits: 1,
})

const shortDateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'short',
})

const dayHeaderFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  weekday: 'long',
})

const monthFormatter = new Intl.DateTimeFormat('tr-TR', {
  month: 'long',
  year: 'numeric',
})

const monthNameFormatter = new Intl.DateTimeFormat('tr-TR', { month: 'long' })

// 1234.5 → "₺1.234,50"   ·   -300 → "-₺300,00"
export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}

// İşaretli tutar: 10000 → "+₺10.000,00"
export function formatSignedCurrency(amount: number): string {
  if (amount === 0) return currencyFormatter.format(0)
  return `${amount > 0 ? '+' : '−'}${currencyFormatter.format(Math.abs(amount))}`
}

// Grafik etiketleri için kuruşsuz: 5750.4 → "₺5.750"
export function formatCurrencyRounded(amount: number): string {
  return roundedCurrencyFormatter.format(amount)
}

// Oran → yüzde: 0.124 → "%12,4"
export function formatPercent(ratio: number): string {
  return percentFormatter.format(ratio)
}

// "2026-11-13" → "13 Kas"
export function formatShortDate(date: string): string {
  return shortDateFormatter.format(parseDate(date))
}

// "2026-11-13" → "13 Kasım Cuma"
export function formatDayHeader(date: string): string {
  return dayHeaderFormatter.format(parseDate(date))
}

// "2026-11" → "Kasım 2026"
export function formatMonth(monthKey: string): string {
  return monthFormatter.format(parseDate(`${monthKey}-01`))
}

// "2026-11" → "Kasım"
export function formatMonthName(monthKey: string): string {
  return monthNameFormatter.format(parseDate(`${monthKey}-01`))
}
