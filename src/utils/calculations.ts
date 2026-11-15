import { CATEGORIES, getCategory } from '../constants/categories'
import type { CategoryId, ChartGroupId } from '../interfaces/Category'
import type { Deposit } from '../interfaces/Deposit'
import type { Expense } from '../interfaces/Expense'
import { getMonthKey, getWeekdayIndex } from './date'

// Kuruşa yuvarlar (-0 yerine 0 döner)
export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100 || 0
}

// Tutarların toplamı
export function sumAmounts(items: { amount: number }[]): number {
  return roundMoney(items.reduce((total, item) => total + item.amount, 0))
}

// Bakiye = toplam para girişi − toplam harcama (tüm zamanlar)
export function calculateBalance(
  deposits: Deposit[],
  expenses: Expense[],
): number {
  return roundMoney(sumAmounts(deposits) - sumAmounts(expenses))
}

// Verilen aya ait kayıtlar
export function filterByMonth<T extends { date: string }>(
  items: T[],
  monthKey: string,
): T[] {
  return items.filter((item) => getMonthKey(item.date) === monthKey)
}

// Kategori başına toplam tutar ve işlem sayısı
export function summarizeByCategory(
  expenses: Expense[],
): Record<CategoryId, { total: number; count: number }> {
  const summary = {} as Record<CategoryId, { total: number; count: number }>
  for (const category of CATEGORIES) {
    summary[category.id] = { total: 0, count: 0 }
  }
  for (const expense of expenses) {
    const entry = summary[getCategory(expense.categoryId).id]
    entry.total = roundMoney(entry.total + expense.amount)
    entry.count += 1
  }
  return summary
}

// Grafik grubu başına toplam (4 ana kategori + "Diğer")
export function totalsByChartGroup(
  expenses: Expense[],
): Record<ChartGroupId, number> {
  const totals: Record<ChartGroupId, number> = {
    groceries: 0,
    bills: 0,
    food: 0,
    transport: 0,
    other: 0,
  }
  for (const expense of expenses) {
    const group = getCategory(expense.categoryId).chartGroup
    totals[group] = roundMoney(totals[group] + expense.amount)
  }
  return totals
}

// Haftanın günlerine göre toplam: [Pzt, Sal, Çar, Per, Cum, Cmt, Paz]
export function totalsByWeekday(expenses: Expense[]): number[] {
  const totals = [0, 0, 0, 0, 0, 0, 0]
  for (const expense of expenses) {
    const index = getWeekdayIndex(expense.date)
    totals[index] = roundMoney(totals[index] + expense.amount)
  }
  return totals
}

// Yüzde değişim; önceki değer 0 ise null
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null
  return (current - previous) / previous
}
