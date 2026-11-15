import type { Deposit } from './Deposit'
import type { Expense } from './Expense'

// Listede gösterilen işlem: harcama ya da para girişi
export type Transaction =
  | { kind: 'expense'; data: Expense }
  | { kind: 'deposit'; data: Deposit }

// Aynı güne ait işlemler
export interface TransactionGroup {
  date: string
  items: Transaction[]
}
