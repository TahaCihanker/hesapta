import { useState } from 'react'
import { CHART_GROUPS } from '../../constants/categories'
import type { ChartGroupId } from '../../interfaces/Category'
import { cn } from '../../utils/cn'
import { formatCurrency, formatPercent } from '../../utils/format'

interface CategoryDonutProps {
  totals: Record<ChartGroupId, number>
}

const SIZE = 200
const RADIUS = 76
const STROKE = 26
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const GAP = 3

// Kategori dağılımı halka grafiği
export function CategoryDonut({ totals }: CategoryDonutProps) {
  const [activeId, setActiveId] = useState<ChartGroupId | null>(null)
  const total = CHART_GROUPS.reduce((sum, group) => sum + totals[group.id], 0)
  const visibleCount = CHART_GROUPS.filter((group) => totals[group.id] > 0).length

  // Dilimlerin uzunluğu ve başlangıç noktası
  const lengths = CHART_GROUPS.map((group) =>
    total > 0 ? (totals[group.id] / total) * CIRCUMFERENCE : 0,
  )
  const slices = CHART_GROUPS.map((group, index) => ({
    group,
    value: totals[group.id],
    length: lengths[index],
    offset: lengths.slice(0, index).reduce((sum, length) => sum + length, 0),
  }))

  const active = slices.find((slice) => slice.group.id === activeId)

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row xl:flex-col">
      <div className="relative w-44 shrink-0">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="block h-auto w-full -rotate-90"
          role="img"
          aria-label="Bu ayın harcamalarının kategori dağılımı"
        >
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="#f1f5f9" strokeWidth={STROKE} />
          {slices.map((slice) =>
            slice.length > 0 ? (
              <circle
                key={slice.group.id}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={slice.group.color}
                strokeWidth={activeId === slice.group.id ? STROKE + 6 : STROKE}
                strokeDasharray={`${Math.max(slice.length - (visibleCount > 1 ? GAP : 0), 0)} ${CIRCUMFERENCE}`}
                strokeDashoffset={-slice.offset}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setActiveId(slice.group.id)}
                onMouseLeave={() => setActiveId(null)}
              />
            ) : null,
          )}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs text-slate-500">{active ? active.group.name : 'Toplam'}</span>
          <span className="text-lg font-semibold text-slate-900 tabular-nums">
            {formatCurrency(active ? active.value : total)}
          </span>
        </div>
      </div>

      <ul className="w-full min-w-0 flex-1 space-y-1">
        {slices.map((slice) => (
          <li
            key={slice.group.id}
            onMouseEnter={() => setActiveId(slice.group.id)}
            onMouseLeave={() => setActiveId(null)}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition',
              activeId === slice.group.id && 'bg-slate-50',
            )}
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: slice.group.color }} />
            <span className="flex-1 truncate text-slate-600">{slice.group.name}</span>
            <span className="font-medium text-slate-900 tabular-nums">{formatCurrency(slice.value)}</span>
            <span className="w-12 text-right text-xs text-slate-500 tabular-nums">
              {total > 0 ? formatPercent(slice.value / total) : '—'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
