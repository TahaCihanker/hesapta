// Para girişi (kategorisiz)
export interface Deposit {
  id: string
  amount: number
  date: string // "YYYY-MM-DD"
  createdAt: string
}

export type NewDeposit = Omit<Deposit, 'id' | 'createdAt'>
