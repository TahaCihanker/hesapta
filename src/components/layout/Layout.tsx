import { X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { useWallet } from '../../context/useWallet'
import { cn } from '../../utils/cn'
import { DepositModal } from '../DepositModal'
import { buttonClass } from '../ui/buttonStyles'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { Toast } from '../ui/Toast'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import type { LayoutContext } from './useLayout'

interface ToastState {
  id: number
  message: string
}

// Ortak sayfa iskeleti: sol menü, üst çubuk ve sayfa içeriği
export function Layout() {
  const { clearAllData, expenses, deposits } = useWallet()
  const navigate = useNavigate()
  const location = useLocation()

  // Karşılama ekranı tüm alanı kaplar
  const isWelcomeScreen =
    location.pathname === '/' && expenses.length === 0 && deposits.length === 0
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [isDepositOpen, setDepositOpen] = useState(false)
  const [isResetOpen, setResetOpen] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  const hideToast = useCallback(() => setToast(null), [])

  const layoutContext: LayoutContext = {
    openDepositModal: () => setDepositOpen(true),
    showToast: (message) => setToast({ id: Date.now(), message }),
  }

  const closeMenu = () => setMenuOpen(false)

  function handleReset() {
    clearAllData()
    setResetOpen(false)
    layoutContext.showToast('Tüm veriler silindi')
    navigate('/')
  }

  const sidebarProps = {
    onAddMoney: layoutContext.openDepositModal,
    onResetData: () => setResetOpen(true),
  }

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Masaüstü menü */}
      <aside className="sticky top-0 hidden h-svh border-r border-slate-200/80 lg:block">
        <Sidebar {...sidebarProps} />
      </aside>

      {/* Mobil menü */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menü">
          <div className="absolute inset-0 bg-slate-900/40" onClick={closeMenu} />
          <div className="relative h-full w-72 max-w-[85%] shadow-xl">
            <Sidebar {...sidebarProps} onNavigate={closeMenu} />
            <button
              type="button"
              className={cn(buttonClass('ghost', 'icon'), 'absolute top-3.5 right-3')}
              onClick={closeMenu}
              aria-label="Menüyü kapat"
            >
              <X size={18} aria-hidden />
            </button>
          </div>
        </div>
      )}

      <div className="min-w-0">
        <Topbar
          onMenuClick={() => setMenuOpen(true)}
          onAddMoney={layoutContext.openDepositModal}
        />
        <main className={isWelcomeScreen ? undefined : 'mx-auto max-w-7xl p-4 sm:p-6 lg:p-8'}>
          <Outlet context={layoutContext} />
        </main>
      </div>

      {isDepositOpen && (
        <DepositModal
          onClose={() => setDepositOpen(false)}
          onSaved={layoutContext.showToast}
        />
      )}

      {isResetOpen && (
        <ConfirmDialog
          title="Tüm verileri sil"
          description="Bütün harcamaların ve para girişlerin kalıcı olarak silinecek. Bu işlem geri alınamaz."
          confirmLabel="Hepsini sil"
          onConfirm={handleReset}
          onCancel={() => setResetOpen(false)}
        />
      )}

      {toast && <Toast key={toast.id} message={toast.message} onClose={hideToast} />}
    </div>
  )
}
