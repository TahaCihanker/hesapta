import { Menu, Plus, Search, Wallet } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { cn } from '../../utils/cn'
import { buttonClass } from '../ui/buttonStyles'
import { inputClass } from '../ui/inputStyles'
import { Logo } from './Logo'

interface TopbarProps {
  onMenuClick: () => void
  onAddMoney: () => void
}

export function Topbar({ onMenuClick, onAddMoney }: TopbarProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  // Arama İşlemler sayfasında yapılır
  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const term = query.trim()
    navigate(term ? `/islemler?q=${encodeURIComponent(term)}` : '/islemler')
    setQuery('')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        className={cn(buttonClass('ghost', 'icon'), 'lg:hidden')}
        onClick={onMenuClick}
        aria-label="Menüyü aç"
      >
        <Menu size={20} aria-hidden />
      </button>
      <div className="lg:hidden">
        <Logo />
      </div>

      <form
        onSubmit={handleSearch}
        role="search"
        className="relative hidden max-w-sm flex-1 sm:block"
      >
        <Search
          size={16}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="İşlem ara…"
          aria-label="İşlem ara"
          className={cn(inputClass(), 'pl-9')}
        />
      </form>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className={cn(buttonClass('secondary'), 'max-md:hidden')}
          onClick={onAddMoney}
        >
          <Wallet size={16} aria-hidden />
          Para ekle
        </button>
        <Link
          to="/harcama/yeni"
          className={buttonClass('primary')}
          aria-label="Harcama ekle"
        >
          <Plus size={16} aria-hidden />
          <span className="hidden sm:inline">Harcama ekle</span>
        </Link>
      </div>
    </header>
  )
}
