import { Link } from 'react-router'
import { CATEGORIES } from '../../constants/categories'
import type { Expense } from '../../interfaces/Expense'
import { summarizeByCategory, sumAmounts } from '../../utils/calculations'
import { cn } from '../../utils/cn'
import { formatCurrency, formatPercent } from '../../utils/format'
import { CategoryIcon } from '../CategoryIcon'

interface CategoryTableProps {
  expenses: Expense[]
  monthKey: string
}

const ROW_GRID =
  'grid grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_5.5rem] items-center gap-3 sm:grid-cols-[minmax(0,1.2fr)_3.5rem_minmax(0,1fr)_6.5rem] sm:gap-4'

// Kategori tablosu: tutar, işlem sayısı ve pay
export function CategoryTable({ expenses, monthKey }: CategoryTableProps) {
  const summary = summarizeByCategory(expenses)
  const monthTotal = sumAmounts(expenses)
  const rows = CATEGORIES.map((category) => ({ category, ...summary[category.id] })).sort(
    (a, b) => b.total - a.total,
  )

  return (
    <div className="-mx-2">
      <div
        className={cn(
          ROW_GRID,
          'rounded-lg bg-slate-50 px-2 py-2 text-xs font-medium tracking-wide text-slate-500 uppercase',
        )}
      >
        <span>Kategori</span>
        <span className="hidden sm:block">İşlem</span>
        <span>Pay</span>
        <span className="text-right">Tutar</span>
      </div>
      <ul className="divide-y divide-slate-100">
        {rows.map(({ category, total, count }) => {
          const share = monthTotal > 0 ? total / monthTotal : 0
          return (
            <li key={category.id}>
              <Link
                to={`/islemler?ay=${monthKey}&tur=harcama&kategori=${category.id}`}
                className={cn(
                  ROW_GRID,
                  'rounded-lg px-2 py-2.5 text-sm transition hover:bg-slate-50',
                  total === 0 && 'opacity-50',
                )}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <CategoryIcon icon={category.icon} color={category.color} size="sm" />
                  <span className="truncate font-medium text-slate-900">{category.name}</span>
                </span>
                <span className="hidden text-slate-500 tabular-nums sm:block">{count}</span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${share * 100}%`, backgroundColor: category.color }}
                    />
                  </span>
                  <span className="w-10 text-right text-xs text-slate-500 tabular-nums">
                    {formatPercent(share)}
                  </span>
                </span>
                <span className="text-right font-medium text-slate-900 tabular-nums">
                  {formatCurrency(total)}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
