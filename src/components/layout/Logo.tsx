import { Wallet } from 'lucide-react'
import { Link } from 'react-router'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Hesapta ana sayfa">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
        <Wallet size={18} aria-hidden />
      </span>
      <span className="text-lg font-semibold tracking-tight text-slate-900">
        Hesapta
      </span>
    </Link>
  )
}
