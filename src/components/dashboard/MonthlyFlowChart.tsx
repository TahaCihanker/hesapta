import { useState } from 'react'
import { CHART_GROUPS } from '../../constants/categories'
import type { ChartGroupId } from '../../interfaces/Category'
import { cn } from '../../utils/cn'
import { formatCurrency, formatCurrencyRounded, formatMonthName } from '../../utils/format'
import { ChartTooltip, type TooltipData } from './ChartTooltip'

export interface MonthTotals {
  monthKey: string
  totals: Record<ChartGroupId, number>
}

interface MonthlyFlowChartProps {
  months: MonthTotals[]
  selectedMonth: string
}

// Çizim alanı ölçüleri
const WIDTH = 560
const HEIGHT = 250
const BASELINE = 220
const MAX_BAR_HEIGHT = 175
const BAR_WIDTH = 76
const SIDE_PADDING = 70
const SEGMENT_GAP = 3

// Kategorilere göre yığılmış aylık sütun grafiği
export function MonthlyFlowChart({ months, selectedMonth }: MonthlyFlowChartProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)

  const monthTotals = months.map((month) =>
    CHART_GROUPS.reduce((sum, group) => sum + month.totals[group.id], 0),
  )
  const scale = MAX_BAR_HEIGHT / Math.max(1, ...monthTotals)
  const step = (WIDTH - SIDE_PADDING * 2) / Math.max(1, months.length - 1)

  // Sütunların ve parçalarının konumları
  const columns = months.map((month, index) => {
    const x = SIDE_PADDING + index * step
    let y = BASELINE
    const segments = CHART_GROUPS.map((group) => {
      const value = month.totals[group.id]
      if (value <= 0) return { group, value, top: y, bottom: y }
      const height = Math.max(value * scale, 3)
      const segment = { group, value, top: y - height, bottom: y }
      y -= height + SEGMENT_GAP
      return segment
    })
    return { month, x, segments, total: monthTotals[index], top: y + SEGMENT_GAP }
  })

  return (
    <div onMouseLeave={() => setTooltip(null)}>
      <div className="relative">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block h-auto w-full"
          role="img"
          aria-label="Son üç ayın harcamaları, kategorilere göre yığılmış sütun grafiği"
        >
          {/* Akış bantları */}
          {columns.slice(0, -1).map((column, index) => {
            const next = columns[index + 1]
            return column.segments.map((segment, groupIndex) => {
              const target = next.segments[groupIndex]
              if (segment.value <= 0 && target.value <= 0) return null
              const x1 = column.x + BAR_WIDTH / 2
              const x2 = next.x - BAR_WIDTH / 2
              return (
                <polygon
                  key={`${column.month.monthKey}-${segment.group.id}`}
                  points={`${x1},${segment.top} ${x2},${target.top} ${x2},${target.bottom} ${x1},${segment.bottom}`}
                  fill={segment.group.color}
                  fillOpacity={0.12}
                />
              )
            })
          })}

          {/* Sütun parçaları */}
          {columns.map((column) =>
            column.segments.map((segment) => {
              const height = segment.bottom - segment.top
              if (height <= 0) return null
              return (
                <rect
                  key={`${column.month.monthKey}-${segment.group.id}`}
                  x={column.x - BAR_WIDTH / 2}
                  y={segment.top}
                  width={BAR_WIDTH}
                  height={height}
                  rx={Math.min(6, height / 2)}
                  fill={segment.group.color}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onMouseEnter={() =>
                    setTooltip({
                      left: (column.x / WIDTH) * 100,
                      top: (segment.top / HEIGHT) * 100,
                      title: `${formatMonthName(column.month.monthKey)} · ${segment.group.name}`,
                      value: formatCurrency(segment.value),
                    })
                  }
                />
              )
            }),
          )}
        </svg>

        {columns.map((column) => (
          <span
            key={`total-${column.month.monthKey}`}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full pb-1.5 text-xs font-semibold text-slate-900 tabular-nums"
            style={{ left: `${(column.x / WIDTH) * 100}%`, top: `${(column.top / HEIGHT) * 100}%` }}
          >
            {formatCurrencyRounded(column.total)}
          </span>
        ))}
        {tooltip && <ChartTooltip {...tooltip} />}
      </div>
      <div className="relative h-6">
        {columns.map((column) => (
          <span
            key={`label-${column.month.monthKey}`}
            className={cn(
              'absolute top-1 -translate-x-1/2 text-xs',
              column.month.monthKey === selectedMonth
                ? 'font-semibold text-slate-900'
                : 'text-slate-500',
            )}
            style={{ left: `${(column.x / WIDTH) * 100}%` }}
          >
            {formatMonthName(column.month.monthKey)}
          </span>
        ))}
      </div>

      <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
        {CHART_GROUPS.map((group) => (
          <li key={group.id} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: group.color }} />
            {group.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
