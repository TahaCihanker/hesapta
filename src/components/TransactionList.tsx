import type { Expense } from '../interfaces/Expense'
import type { Transaction } from '../interfaces/Transaction'
import { roundMoney } from '../utils/calculations'
import { formatDayHeader, formatSignedCurrency } from '../utils/format'
import { groupByDate } from '../utils/transactions'
import { TransactionRow } from './TransactionRow'

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (expense: Expense) => void
}

// İşlemleri gün başlıkları altında listeler
export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const groups = groupByDate(transactions)

  return (
    <div className="space-y-5 py-2">
      {groups.map((group) => {
        const dayNet = roundMoney(
          group.items.reduce(
            (total, item) =>
              item.kind === 'deposit' ? total + item.data.amount : total - item.data.amount,
            0,
          ),
        )
        return (
          <section key={group.date}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs font-medium text-slate-500">
              <h3>{formatDayHeader(group.date)}</h3>
              <span className="tabular-nums">
                {formatSignedCurrency(dayNet)}
              </span>
            </div>
            <ul className="divide-y divide-slate-100">
              {group.items.map((transaction) => (
                <TransactionRow
                  key={transaction.data.id}
                  transaction={transaction}
                  onDelete={onDelete}
                />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
