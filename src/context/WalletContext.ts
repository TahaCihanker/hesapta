import { createContext } from 'react'
import type { Deposit, NewDeposit } from '../interfaces/Deposit'
import type { Expense, NewExpense } from '../interfaces/Expense'

// Context'in sunduğu veriler ve fonksiyonlar
export interface WalletContextValue {
  expenses: Expense[]
  deposits: Deposit[]
  balance: number
  addExpense: (data: NewExpense) => void
  updateExpense: (id: string, data: NewExpense) => void
  deleteExpense: (id: string) => void
  addDeposit: (data: NewDeposit) => void
  loadSampleData: () => void
  clearAllData: () => void
}

export const WalletContext = createContext<WalletContextValue | null>(null)
