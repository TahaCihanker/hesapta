import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface BadgeProps {
  tone: 'success' | 'danger' | 'neutral'
  icon?: LucideIcon
  children: ReactNode
}

const tones = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  danger: 'bg-red-50 text-red-700 ring-red-600/15',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-500/10',
}

// Küçük renkli etiket
export function Badge({ tone, icon: Icon, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        tones[tone],
      )}
    >
      {Icon && <Icon size={12} aria-hidden />}
      {children}
    </span>
  )
}
