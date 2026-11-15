import { useEffect, useState, type ReactNode } from 'react'
import type { Deposit, NewDeposit } from '../interfaces/Deposit'
import type { Expense, NewExpense } from '../interfaces/Expense'
import {
  loadDeposits,
  loadExpenses,
  saveDeposits,
  saveExpenses,
} from '../services/storage'
import { calculateBalance } from '../utils/calculations'
import { createSampleData } from '../utils/sampleData'
import { WalletContext, type WalletContextValue } from './WalletContext'

interface WalletProviderProps {
  children: ReactNode
}

// Harcamaları ve para girişlerini tutar, LocalStorage ile eşitler
export function WalletProvider({ children }: WalletProviderProps) {
  const [expenses, setExpenses] = useState<Expense[]>(loadExpenses)
  const [deposits, setDeposits] = useState<Deposit[]>(loadDeposits)

  // Listeler her değiştiğinde LocalStorage'a yaz
  useEffect(() => {
    saveExpenses(expenses)
  }, [expenses])

  useEffect(() => {
    saveDeposits(deposits)
  }, [deposits])

  // Bakiye saklanmaz, hesaplanır
  const balance = calculateBalance(deposits, expenses)

  function addExpense(data: NewExpense) {
    const expense: Expense = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setExpenses((current) => [expense, ...current])
  }

  function updateExpense(id: string, data: NewExpense) {
    setExpenses((current) =>
      current.map((expense) =>
        // id ve createdAt korunur
        expense.id === id
          ? { ...data, id: expense.id, createdAt: expense.createdAt }
          : expense,
      ),
    )
  }

  function deleteExpense(id: string) {
    setExpenses((current) => current.filter((expense) => expense.id !== id))
  }

  function addDeposit(data: NewDeposit) {
    const deposit: Deposit = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setDeposits((current) => [deposit, ...current])
  }

  // Örnek verileri yükler
  function loadSampleData() {
    const sample = createSampleData()
    setExpenses(sample.expenses)
    setDeposits(sample.deposits)
  }

  function clearAllData() {
    setExpenses([])
    setDeposits([])
  }

  const value: WalletContextValue = {
    expenses,
    deposits,
    balance,
    addExpense,
    updateExpense,
    deleteExpense,
    addDeposit,
    loadSampleData,
    clearAllData,
  }

  return <WalletContext value={value}>{children}</WalletContext>
}
