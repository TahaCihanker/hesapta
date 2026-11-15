import { ArrowRight, ListOrdered } from 'lucide-react'
import { Link } from 'react-router'
import type { Transaction } from '../../interfaces/Transaction'
import { TransactionRow } from '../TransactionRow'
import { Card, CardHeader } from '../ui/Card'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

// Son işlemler listesi
export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader
        icon={ListOrdered}
        title="Son işlemler"
        action={
          <Link
            to="/islemler"
            className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Tümünü gör
            <ArrowRight size={14} aria-hidden />
          </Link>
        }
      />
      <ul className="-my-1 divide-y divide-slate-100">
        {transactions.map((transaction) => (
          <TransactionRow key={transaction.data.id} transaction={transaction} showDate />
        ))}
      </ul>
    </Card>
  )
}
