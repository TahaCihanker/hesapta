import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Card } from '../ui/Card'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  valueClassName?: string
  badge?: ReactNode
  note?: string
}

// Özet sayfasındaki istatistik kartı
export function StatCard({ icon: Icon, label, value, valueClassName, badge, note }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500">
          <Icon size={16} aria-hidden />
        </span>
        {label}
      </div>
      <p
        className={cn(
          'mt-4 truncate text-3xl font-semibold tracking-tight tabular-nums',
          valueClassName ?? 'text-slate-900',
        )}
      >
        {value}
      </p>
      <div className="mt-2 flex min-h-6 flex-wrap items-center gap-2">
        {badge}
        {note && <span className="text-xs text-slate-500">{note}</span>}
      </div>
    </Card>
  )
}
