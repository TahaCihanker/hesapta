import { useState } from 'react'
import { cn } from '../../utils/cn'
import { formatCurrency, formatCurrencyRounded } from '../../utils/format'
import { ChartTooltip, type TooltipData } from './ChartTooltip'

interface WeekdayChartProps {
  totals: number[] // [Pzt, Sal, Çar, Per, Cum, Cmt, Paz]
}

const DAY_LABELS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
const DAY_NAMES = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']

const WIDTH = 320
const HEIGHT = 230
const BASELINE = 210
const MAX_BAR_HEIGHT = 170
const BAR_WIDTH = 30

// Haftanın günlerine göre harcama grafiği
export function WeekdayChart({ totals }: WeekdayChartProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const max = Math.max(...totals)
  const highlightIndex = max > 0 ? totals.indexOf(max) : -1
  const step = WIDTH / totals.length

  const bars = totals.map((value, index) => {
    const height = max > 0 ? Math.max((value / max) * MAX_BAR_HEIGHT, value > 0 ? 6 : 0) : 0
    const x = index * step + (step - BAR_WIDTH) / 2
    // Boş günler için silik taban çubuğu
    const drawnHeight = Math.max(height, 6)
    return { value, index, x, center: x + BAR_WIDTH / 2, top: BASELINE - drawnHeight, height: drawnHeight }
  })

  return (
    <div onMouseLeave={() => setTooltip(null)}>
      <div className="relative">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block h-auto w-full"
          role="img"
          aria-label={
            highlightIndex >= 0
              ? `Haftanın günlerine göre harcama; en çok ${DAY_NAMES[highlightIndex]}`
              : 'Haftanın günlerine göre harcama; bu ay harcama yok'
          }
        >
          <defs>
            <linearGradient id="weekday-highlight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          {bars.map((bar) => (
            <rect
              key={bar.index}
              x={bar.x}
              y={bar.top}
              width={BAR_WIDTH}
              height={bar.height}
              rx={8}
              fill={bar.index === highlightIndex ? 'url(#weekday-highlight)' : '#eef0f6'}
              className="cursor-pointer transition-opacity hover:opacity-80"
              onMouseEnter={() =>
                setTooltip({
                  left: (bar.center / WIDTH) * 100,
                  top: (bar.top / HEIGHT) * 100,
                  title: DAY_NAMES[bar.index],
                  value: formatCurrency(bar.value),
                })
              }
            />
          ))}
        </svg>

        {highlightIndex >= 0 && !tooltip && (
          <span
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full pb-1.5 text-xs font-semibold text-slate-900 tabular-nums"
            style={{
              left: `${(bars[highlightIndex].center / WIDTH) * 100}%`,
              top: `${(bars[highlightIndex].top / HEIGHT) * 100}%`,
            }}
          >
            {formatCurrencyRounded(max)}
          </span>
        )}
        {tooltip && <ChartTooltip {...tooltip} />}
      </div>

      <div className="relative h-6">
        {bars.map((bar) => (
          <span
            key={bar.index}
            className={cn(
              'absolute top-1 -translate-x-1/2 text-xs',
              bar.index === highlightIndex ? 'font-semibold text-slate-900' : 'text-slate-500',
            )}
            style={{ left: `${(bar.center / WIDTH) * 100}%` }}
          >
            {DAY_LABELS[bar.index]}
          </span>
        ))}
      </div>
    </div>
  )
}
