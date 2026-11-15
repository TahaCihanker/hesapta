import {
  ArrowDownLeft,
  ArrowUpRight,
  Inbox,
  Plus,
  Scale,
  Search,
  SearchX,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useLayout } from '../components/layout/useLayout'
import { MonthPicker } from '../components/MonthPicker'
import { TransactionList } from '../components/TransactionList'
import { buttonClass } from '../components/ui/buttonStyles'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { inputClass } from '../components/ui/inputStyles'
import { PageHeader } from '../components/ui/PageHeader'
import { CATEGORIES } from '../constants/categories'
import { useWallet } from '../context/useWallet'
import { useMonthParam } from '../hooks/useMonthParam'
import type { CategoryId } from '../interfaces/Category'
import type { Expense } from '../interfaces/Expense'
import { filterByMonth, roundMoney, sumAmounts } from '../utils/calculations'
import { cn } from '../utils/cn'
import { formatCurrency, formatMonth, formatSignedCurrency } from '../utils/format'
import { buildTransactions, matchesSearch } from '../utils/transactions'

type KindFilter = 'all' | 'expense' | 'deposit'

// Filtre seçenekleri
const KIND_OPTIONS: { value: KindFilter; label: string; param: string }[] = [
  { value: 'all', label: 'Tümü', param: '' },
  { value: 'expense', label: 'Harcamalar', param: 'harcama' },
  { value: 'deposit', label: 'Para girişleri', param: 'giris' },
]

function parseKind(param: string | null): KindFilter {
  return KIND_OPTIONS.find((option) => option.param === param)?.value ?? 'all'
}

interface SummaryTileProps {
  label: string
  value: string
  icon: LucideIcon
  tone: 'neutral' | 'positive' | 'negative'
}

function SummaryTile({ label, value, icon: Icon, tone }: SummaryTileProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs sm:p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 max-sm:hidden">
        <Icon size={16} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p
          className={cn(
            'truncate text-sm font-semibold tabular-nums sm:text-base',
            tone === 'positive' && 'text-emerald-600',
            tone === 'negative' && 'text-red-600',
            tone === 'neutral' && 'text-slate-900',
          )}
        >
          {value}
        </p>
      </div>
    </div>
  )
}

// İşlemler sayfası: listeleme, filtre ve silme
export function TransactionsPage() {
  const { expenses, deposits, deleteExpense } = useWallet()
  const { showToast, openDepositModal } = useLayout()
  const [month, setMonth] = useMonthParam()
  const [searchParams, setSearchParams] = useSearchParams()
  const [pendingDelete, setPendingDelete] = useState<Expense | null>(null)

  // Filtreler adres çubuğunda tutulur
  const query = searchParams.get('q') ?? ''
  const kind = parseKind(searchParams.get('tur'))
  const categoryParam = searchParams.get('kategori') ?? ''
  const categoryFilter = CATEGORIES.some((category) => category.id === categoryParam)
    ? (categoryParam as CategoryId)
    : ''
  const isSearching = query.trim() !== ''
  const hasFilters = kind !== 'all' || categoryFilter !== '' || isSearching

  function updateParam(key: string, value: string) {
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current)
        if (value) params.set(key, value)
        else params.delete(key)
        return params
      },
      { replace: true },
    )
  }

  function clearFilters() {
    setSearchParams({ ay: month }, { replace: true })
  }

  // Arama yaparken tüm aylarda ara; aksi halde sadece seçili ay
  const scopedExpenses = isSearching ? expenses : filterByMonth(expenses, month)
  const scopedDeposits = isSearching ? deposits : filterByMonth(deposits, month)
  const totalIn = sumAmounts(scopedDeposits)
  const totalOut = sumAmounts(scopedExpenses)
  const net = roundMoney(totalIn - totalOut)

  const transactions = buildTransactions(scopedExpenses, scopedDeposits).filter(
    (transaction) => {
      if (kind !== 'all' && transaction.kind !== kind) return false
      if (
        categoryFilter &&
        (transaction.kind !== 'expense' || transaction.data.categoryId !== categoryFilter)
      )
        return false
      return matchesSearch(transaction, query)
    },
  )

  function confirmDelete() {
    if (!pendingDelete) return
    deleteExpense(pendingDelete.id)
    showToast(`"${pendingDelete.title}" silindi`)
    setPendingDelete(null)
  }

  return (
    <>
      <PageHeader
        title="İşlemler"
        description={
          isSearching
            ? `"${query.trim()}" için tüm aylardaki sonuçlar`
            : 'Para girişlerin ve harcamaların, gün gün.'
        }
        actions={!isSearching && <MonthPicker value={month} onChange={setMonth} />}
      />

      <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
        <SummaryTile
          label={isSearching ? 'Giren' : 'Bu ay giren'}
          value={formatSignedCurrency(totalIn)}
          icon={ArrowDownLeft}
          tone="positive"
        />
        <SummaryTile
          label={isSearching ? 'Çıkan' : 'Bu ay çıkan'}
          value={formatSignedCurrency(-totalOut)}
          icon={ArrowUpRight}
          tone="neutral"
        />
        <SummaryTile
          label="Net"
          value={formatSignedCurrency(net)}
          icon={Scale}
          tone={net < 0 ? 'negative' : 'positive'}
        />
      </div>

      <Card className="p-0">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center">
          <div
            className="flex rounded-lg bg-slate-100 p-1"
            role="group"
            aria-label="İşlem türü"
          >
            {KIND_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={kind === option.value}
                onClick={() => updateParam('tur', option.param)}
                className={cn(
                  'flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition',
                  kind === option.value
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => updateParam('kategori', event.target.value)}
            disabled={kind === 'deposit'}
            aria-label="Kategori"
            className={cn(inputClass(), 'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 lg:w-48')}
          >
            <option value="">Tüm kategoriler</option>
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <div className="relative lg:ml-auto lg:w-64">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(event) => updateParam('q', event.target.value)}
              placeholder="Ad veya notta ara…"
              aria-label="İşlemlerde ara"
              className={cn(inputClass(), 'pl-9')}
            />
          </div>

          {hasFilters && (
            <button type="button" className={buttonClass('ghost', 'sm')} onClick={clearFilters}>
              Filtreleri temizle
            </button>
          )}
        </div>

        <div className="px-4 sm:px-5">
          {transactions.length > 0 ? (
            <TransactionList transactions={transactions} onDelete={setPendingDelete} />
          ) : hasFilters ? (
            <EmptyState
              icon={SearchX}
              title="Sonuç bulunamadı"
              description="Bu filtrelere uyan bir işlem yok. Filtreleri değiştirip tekrar dene."
              action={
                <button type="button" className={buttonClass('secondary')} onClick={clearFilters}>
                  Filtreleri temizle
                </button>
              }
            />
          ) : (
            <EmptyState
              icon={Inbox}
              title={`${formatMonth(month)} için henüz işlem yok`}
              description="Hesabına para ekleyerek ya da ilk harcamanı girerek başla."
              action={
                <>
                  <button type="button" className={buttonClass('secondary')} onClick={openDepositModal}>
                    <Wallet size={16} aria-hidden />
                    Para ekle
                  </button>
                  <Link to="/harcama/yeni" className={buttonClass('primary')}>
                    <Plus size={16} aria-hidden />
                    Harcama ekle
                  </Link>
                </>
              }
            />
          )}
        </div>
      </Card>

      {pendingDelete && (
        <ConfirmDialog
          title="Harcamayı sil"
          description={`"${pendingDelete.title}" (${formatCurrency(pendingDelete.amount)}) kalıcı olarak silinecek ve tutarı bakiyene geri eklenecek.`}
          confirmLabel="Sil"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </>
  )
}
