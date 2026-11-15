import type { CategoryId } from '../interfaces/Category'
import type { Deposit } from '../interfaces/Deposit'
import type { Expense } from '../interfaces/Expense'
import { roundMoney } from './calculations'
import { getCurrentMonthKey, shiftMonth, todayISO } from './date'

// [ayın günü, ad, kategori, tutar]
type ExpenseTemplate = [number, string, CategoryId, number]

// Her ay tekrar eden örnek harcamalar
const MONTHLY_EXPENSES: ExpenseTemplate[] = [
  [2, 'Elektrik faturası', 'bills', 620],
  [3, 'Migros alışverişi', 'groceries', 845.5],
  [4, 'İstanbulkart dolumu', 'transport', 300],
  [5, 'Kahve', 'food', 85],
  [7, 'Sinema', 'entertainment', 360],
  [8, 'İnternet faturası', 'bills', 449.9],
  [10, 'A101 alışverişi', 'groceries', 412.75],
  [12, 'Akşam yemeği', 'food', 640],
  [13, 'Eczane', 'health', 185],
  [15, 'Taksi', 'transport', 210],
  [17, 'Su faturası', 'bills', 170],
  [18, 'Pazar alışverişi', 'groceries', 380],
  [22, 'Öğle yemeği', 'food', 220],
  [24, 'Market alışverişi', 'groceries', 530],
  [27, 'Benzin', 'transport', 900],
  [28, 'Doğalgaz faturası', 'bills', 780],
]

// Aylara özel ek harcamalar
const EXTRA_EXPENSES: ExpenseTemplate[][] = [
  [[20, 'Mont', 'clothing', 1250]],
  [[26, 'Konser bileti', 'entertainment', 750]],
  [[9, 'Diş kontrolü', 'health', 900]],
]

const MONTHLY_DEPOSIT = 10000

// Son 3 ay için örnek veri üretir
export function createSampleData(): { expenses: Expense[]; deposits: Deposit[] } {
  const today = todayISO()
  const currentMonth = getCurrentMonthKey()
  const expenses: Expense[] = []
  const deposits: Deposit[] = []

  EXTRA_EXPENSES.forEach((extras, index) => {
    const monthKey = shiftMonth(currentMonth, index - 2)
    const priceFactor = 1 + index * 0.07
    const dateOf = (day: number) => `${monthKey}-${String(Math.min(day, 28)).padStart(2, '0')}`

    deposits.push({
      id: crypto.randomUUID(),
      amount: MONTHLY_DEPOSIT,
      date: dateOf(1),
      createdAt: `${dateOf(1)}T09:00:00.000Z`,
    })

    for (const [day, title, categoryId, amount] of [...MONTHLY_EXPENSES, ...extras]) {
      const date = dateOf(day)
      if (date > today) continue
      expenses.push({
        id: crypto.randomUUID(),
        title,
        categoryId,
        amount: roundMoney(amount * priceFactor),
        date,
        createdAt: `${date}T12:00:00.000Z`,
      })
    }
  })

  return { expenses, deposits }
}
