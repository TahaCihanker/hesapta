import type { Deposit } from '../interfaces/Deposit'
import type { Expense } from '../interfaces/Expense'

// LocalStorage anahtarları
const EXPENSES_KEY = 'hesapta.expenses'
const DEPOSITS_KEY = 'hesapta.deposits'

function readList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    // Bozuk veri varsa boş listeyle başla
    return []
  }
}

function writeList<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch (error) {
    console.error('Veriler kaydedilemedi:', error)
  }
}

export function loadExpenses(): Expense[] {
  return readList<Expense>(EXPENSES_KEY)
}

export function saveExpenses(expenses: Expense[]): void {
  writeList(EXPENSES_KEY, expenses)
}

export function loadDeposits(): Deposit[] {
  return readList<Deposit>(DEPOSITS_KEY)
}

export function saveDeposits(deposits: Deposit[]): void {
  writeList(DEPOSITS_KEY, deposits)
}
