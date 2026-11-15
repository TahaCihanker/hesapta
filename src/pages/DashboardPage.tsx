import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChartColumnStacked,
  ChartPie,
  Coins,
  Layers,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { CategoryDonut } from '../components/dashboard/CategoryDonut'
import { CategoryTable } from '../components/dashboard/CategoryTable'
import { MonthlyFlowChart } from '../components/dashboard/MonthlyFlowChart'
import { RecentTransactions } from '../components/dashboard/RecentTransactions'
import { StatCard } from '../components/dashboard/StatCard'
import { WeekdayChart } from '../components/dashboard/WeekdayChart'
import { WelcomeCard } from '../components/dashboard/WelcomeCard'
import { useLayout } from '../components/layout/useLayout'
import { MonthPicker } from '../components/MonthPicker'
import { Badge } from '../components/ui/Badge'
import { buttonClass } from '../components/ui/buttonStyles'
import { Card, CardHeader } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { useWallet } from '../context/useWallet'
import { useMonthParam } from '../hooks/useMonthParam'
import {
  filterByMonth,
  percentChange,
  sumAmounts,
  totalsByChartGroup,
  totalsByWeekday,
} from '../utils/calculations'
import { shiftMonth } from '../utils/date'
import { formatCurrency, formatMonth, formatMonthName, formatPercent } from '../utils/format'
import { buildTransactions } from '../utils/transactions'

const WEEKDAY_NAMES = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']

// Özet sayfası
export function DashboardPage() {
  const { expenses, deposits, balance, loadSampleData } = useWallet()
  const { openDepositModal, showToast } = useLayout()
  const [month, setMonth] = useMonthParam()

  // Kayıt yoksa karşılama ekranı
  if (expenses.length === 0 && deposits.length === 0) {
    return (
      <WelcomeCard
        onAddMoney={openDepositModal}
        onLoadSample={() => {
          loadSampleData()
          showToast('Son 3 ayın örnek verileri yüklendi')
        }}
      />
    )
  }

  const previousMonth = shiftMonth(month, -1)
  const monthExpenses = filterByMonth(expenses, month)
  const monthDeposits = filterByMonth(deposits, month)

  const spent = sumAmounts(monthExpenses)
  const previousSpent = sumAmounts(filterByMonth(expenses, previousMonth))
  const change = percentChange(spent, previousSpent)
  const added = sumAmounts(monthDeposits)

  const weekdayTotals = totalsByWeekday(monthExpenses)
  const busiestDay = Math.max(...weekdayTotals) > 0
    ? weekdayTotals.indexOf(Math.max(...weekdayTotals))
    : -1

  // Akış grafiği: seçili ay ve önceki iki ay
  const flowMonths = [shiftMonth(month, -2), previousMonth, month].map((monthKey) => ({
    monthKey,
    totals: totalsByChartGroup(filterByMonth(expenses, monthKey)),
  }))

  const recentTransactions = buildTransactions(expenses, deposits).slice(0, 5)

  return (
    <>
      <PageHeader
        title="Özet"
        description={`${formatMonth(month)} özetin`}
        actions={
          <>
            <MonthPicker value={month} onChange={setMonth} />
            <button type="button" className={buttonClass('secondary')} onClick={openDepositModal}>
              <Wallet size={16} aria-hidden />
              Para ekle
            </button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Wallet}
          label="Bakiye"
          value={formatCurrency(balance)}
          valueClassName={balance < 0 ? 'text-red-600' : undefined}
          badge={
            balance < 0 ? (
              <Badge tone="danger" icon={TrendingDown}>Ekside</Badge>
            ) : (
              <Badge tone="success" icon={TrendingUp}>Artıda</Badge>
            )
          }
          note={balance < 0 ? 'Limitini aştın' : 'Tüm zamanlar'}
        />
        <StatCard
          icon={ReceiptText}
          label="Bu ay harcanan"
          value={formatCurrency(spent)}
          badge={
            change === null ? undefined : change > 0 ? (
              <Badge tone="danger" icon={ArrowUpRight}>{formatPercent(change)}</Badge>
            ) : change < 0 ? (
              <Badge tone="success" icon={ArrowDownRight}>{formatPercent(Math.abs(change))}</Badge>
            ) : (
              <Badge tone="neutral">Değişim yok</Badge>
            )
          }
          note={change === null ? `${formatMonthName(previousMonth)} ayında harcama yok` : 'geçen aya göre'}
        />
        <StatCard
          icon={Coins}
          label="Bu ay eklenen"
          value={formatCurrency(added)}
          note={
            monthDeposits.length > 0
              ? `${monthDeposits.length} para girişi`
              : 'Bu ay para eklenmedi'
          }
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader icon={ChartColumnStacked} title="Aylık harcamalar" />
          <p className="text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
            {formatCurrency(spent)}
          </p>
          <p className="mb-2 text-xs text-slate-500">Son 3 ay, kategorilere göre</p>
          <MonthlyFlowChart months={flowMonths} selectedMonth={month} />
        </Card>

        <Card>
          <CardHeader icon={CalendarDays} title="Günlere göre" />
          <p className="text-2xl font-semibold tracking-tight text-slate-900">
            {busiestDay >= 0 ? WEEKDAY_NAMES[busiestDay] : '—'}
          </p>
          <p className="mb-2 text-xs text-slate-500">
            {busiestDay >= 0 ? 'Bu ay en çok harcadığın gün' : 'Bu ay henüz harcama yok'}
          </p>
          <WeekdayChart totals={weekdayTotals} />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <Card>
          <CardHeader icon={ChartPie} title="Kategori dağılımı" />
          <CategoryDonut totals={totalsByChartGroup(monthExpenses)} />
        </Card>
        <Card>
          <CardHeader icon={Layers} title="Kategoriler" />
          <CategoryTable expenses={monthExpenses} monthKey={month} />
        </Card>
      </div>

      <div className="mt-4">
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </>
  )
}
