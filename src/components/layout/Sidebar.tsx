import {
  ArrowLeftRight,
  LayoutDashboard,
  Plus,
  ReceiptText,
  RotateCcw,
  Wallet,
} from 'lucide-react'
import { NavLink } from 'react-router'
import { useWallet } from '../../context/useWallet'
import { cn } from '../../utils/cn'
import { formatCurrency } from '../../utils/format'
import { buttonClass } from '../ui/buttonStyles'
import { Logo } from './Logo'

interface SidebarProps {
  onNavigate?: () => void
  onAddMoney: () => void
  onResetData: () => void
}

function navItemClass({ isActive }: { isActive: boolean }) {
  return cn(
    'flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
    isActive
      ? 'bg-slate-100 text-slate-900'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
  )
}

export function Sidebar({ onNavigate, onAddMoney, onResetData }: SidebarProps) {
  const { balance, expenses, deposits } = useWallet()
  const transactionCount = expenses.length + deposits.length

  function handleAddMoney() {
    onNavigate?.()
    onAddMoney()
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center border-b border-slate-100 px-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Ana menü">
        <div className="space-y-1">
          <p className="px-3 pb-1 text-xs font-medium text-slate-400">Genel</p>
          <NavLink to="/" end className={navItemClass} onClick={onNavigate}>
            <LayoutDashboard size={18} aria-hidden />
            Özet
          </NavLink>
          <NavLink to="/islemler" className={navItemClass} onClick={onNavigate}>
            <ArrowLeftRight size={18} aria-hidden />
            İşlemler
            {transactionCount > 0 && (
              <span className="ml-auto rounded-md border border-slate-200 px-1.5 text-xs text-slate-500 tabular-nums">
                {transactionCount}
              </span>
            )}
          </NavLink>
        </div>

        <div className="space-y-1">
          <p className="px-3 pb-1 text-xs font-medium text-slate-400">Hızlı işlem</p>
          <NavLink to="/harcama/yeni" className={navItemClass} onClick={onNavigate}>
            <ReceiptText size={18} aria-hidden />
            Harcama ekle
          </NavLink>
          <button
            type="button"
            className={navItemClass({ isActive: false })}
            onClick={handleAddMoney}
          >
            <Wallet size={18} aria-hidden />
            Para ekle
          </button>
        </div>
      </nav>

      <div className="space-y-3 border-t border-slate-100 p-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Bakiye</p>
          <p
            className={cn(
              'mt-0.5 text-lg font-semibold tabular-nums',
              balance < 0 ? 'text-red-600' : 'text-emerald-600',
            )}
          >
            {formatCurrency(balance)}
          </p>
        </div>
        <button
          type="button"
          className={cn(buttonClass('secondary'), 'w-full')}
          onClick={handleAddMoney}
        >
          <Plus size={16} aria-hidden />
          Para ekle
        </button>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>© 2026 Hesapta</span>
          {transactionCount > 0 && (
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 hover:text-red-600"
              onClick={() => {
                onNavigate?.()
                onResetData()
              }}
            >
              <RotateCcw size={12} aria-hidden />
              Verileri sıfırla
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
