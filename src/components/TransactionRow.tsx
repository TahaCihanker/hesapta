import { Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { DEPOSIT_APPEARANCE, getCategory } from '../constants/categories'
import type { Expense } from '../interfaces/Expense'
import type { Transaction } from '../interfaces/Transaction'
import { cn } from '../utils/cn'
import { formatShortDate, formatSignedCurrency } from '../utils/format'
import { CategoryIcon } from './CategoryIcon'
import { buttonClass } from './ui/buttonStyles'

interface TransactionRowProps {
  transaction: Transaction
  showDate?: boolean
  onDelete?: (expense: Expense) => void
}

// İşlemin görünümünü hazırlar
function describe(transaction: Transaction) {
  if (transaction.kind === 'expense') {
    const category = getCategory(transaction.data.categoryId)
    return {
      title: transaction.data.title,
      details: [category.name, transaction.data.note],
      icon: category.icon,
      color: category.color,
      amount: -transaction.data.amount,
    }
  }
  return {
    title: 'Para eklendi',
    details: [DEPOSIT_APPEARANCE.name],
    icon: DEPOSIT_APPEARANCE.icon,
    color: DEPOSIT_APPEARANCE.color,
    amount: transaction.data.amount,
  }
}

export function TransactionRow({ transaction, showDate = false, onDelete }: TransactionRowProps) {
  const { title, details, icon, color, amount } = describe(transaction)
  const subtitle = [...details, showDate && formatShortDate(transaction.data.date)]
    .filter(Boolean)
    .join(' · ')

  return (
    <li className="flex items-center gap-3 py-3">
      <CategoryIcon icon={icon} color={color} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">{title}</p>
        <p className="truncate text-xs text-slate-500">{subtitle}</p>
      </div>
      <span
        className={cn(
          'text-sm font-semibold whitespace-nowrap tabular-nums',
          amount < 0 ? 'text-slate-900' : 'text-emerald-600',
        )}
      >
        {formatSignedCurrency(amount)}
      </span>

      {onDelete && (
        // Hizalama için boşluk
        <div className="flex w-[4.75rem] shrink-0 justify-end gap-1">
          {transaction.kind === 'expense' && (
            <>
              <Link
                to={`/harcama/${transaction.data.id}/duzenle`}
                className={buttonClass('ghost', 'icon')}
                aria-label={`${title} harcamasını düzenle`}
                title="Düzenle"
              >
                <Pencil size={16} aria-hidden />
              </Link>
              <button
                type="button"
                className={cn(buttonClass('ghost', 'icon'), 'hover:bg-red-50 hover:text-red-600')}
                onClick={() => onDelete(transaction.data)}
                aria-label={`${title} harcamasını sil`}
                title="Sil"
              >
                <Trash2 size={16} aria-hidden />
              </button>
            </>
          )}
        </div>
      )}
    </li>
  )
}
