import { DEPOSIT_APPEARANCE, getCategory } from '../constants/categories'
import type { Deposit } from '../interfaces/Deposit'
import type { Expense } from '../interfaces/Expense'
import type { Transaction, TransactionGroup } from '../interfaces/Transaction'

// Harcamaları ve para girişlerini tek listede birleştirir, yeniden eskiye sıralar
export function buildTransactions(
  expenses: Expense[],
  deposits: Deposit[],
): Transaction[] {
  const all: Transaction[] = [
    ...expenses.map((data): Transaction => ({ kind: 'expense', data })),
    ...deposits.map((data): Transaction => ({ kind: 'deposit', data })),
  ]
  return all.sort(
    (a, b) =>
      b.data.date.localeCompare(a.data.date) ||
      b.data.createdAt.localeCompare(a.data.createdAt),
  )
}

// Listeyi gün gün gruplar
export function groupByDate(transactions: Transaction[]): TransactionGroup[] {
  const groups: TransactionGroup[] = []
  for (const transaction of transactions) {
    const lastGroup = groups[groups.length - 1]
    if (lastGroup && lastGroup.date === transaction.data.date) {
      lastGroup.items.push(transaction)
    } else {
      groups.push({ date: transaction.data.date, items: [transaction] })
    }
  }
  return groups
}

// Arama metni işlemde geçiyor mu?
export function matchesSearch(transaction: Transaction, query: string): boolean {
  const term = query.trim().toLocaleLowerCase('tr')
  if (!term) return true

  const fields =
    transaction.kind === 'expense'
      ? [
          transaction.data.title,
          transaction.data.note ?? '',
          getCategory(transaction.data.categoryId).name,
        ]
      : ['Para eklendi', DEPOSIT_APPEARANCE.name]

  return fields.some((field) => field.toLocaleLowerCase('tr').includes(term))
}
