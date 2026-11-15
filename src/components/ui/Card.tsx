import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
}

// Beyaz kart
export function Card({ children, className }: CardProps) {
  return (
    <section
      className={cn(
        'min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs',
        className,
      )}
    >
      {children}
    </section>
  )
}

interface CardHeaderProps {
  icon: LucideIcon
  title: string
  action?: ReactNode
}

// Kart başlığı
export function CardHeader({ icon: Icon, title, action }: CardHeaderProps) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500">
        <Icon size={16} aria-hidden />
      </span>
      <h2 className="font-medium text-slate-900">{title}</h2>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  )
}
