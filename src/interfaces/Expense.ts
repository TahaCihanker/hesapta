import type { CategoryId } from './Category'

// Harcama
export interface Expense {
  id: string
  title: string
  amount: number
  categoryId: CategoryId
  date: string // "YYYY-MM-DD", ör. "2026-11-13"
  note?: string
  createdAt: string
}

// Formdan gelen veri (id ve createdAt uygulamada üretilir)
export type NewExpense = Omit<Expense, 'id' | 'createdAt'>
