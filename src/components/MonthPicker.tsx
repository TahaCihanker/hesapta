import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { getCurrentMonthKey, shiftMonth } from '../utils/date'
import { formatMonth } from '../utils/format'

interface MonthPickerProps {
  value: string // "2026-11"
  onChange: (month: string) => void
}

// Ay seçici (gelecek aylara gidilemez)
export function MonthPicker({ value, onChange }: MonthPickerProps) {
  const isCurrentMonth = value >= getCurrentMonthKey()
  const arrowClass =
    'flex h-full w-9 cursor-pointer items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30'

  return (
    <div className="flex h-10 items-stretch overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
      <button
        type="button"
        className={arrowClass}
        onClick={() => onChange(shiftMonth(value, -1))}
        aria-label="Önceki ay"
      >
        <ChevronLeft size={16} aria-hidden />
      </button>
      <span className="flex min-w-36 items-center justify-center gap-2 border-x border-slate-200 px-3 text-sm font-medium text-slate-700">
        <Calendar size={15} className="text-slate-400" aria-hidden />
        {formatMonth(value)}
      </span>
      <button
        type="button"
        className={arrowClass}
        onClick={() => onChange(shiftMonth(value, 1))}
        disabled={isCurrentMonth}
        aria-label="Sonraki ay"
      >
        <ChevronRight size={16} aria-hidden />
      </button>
    </div>
  )
}
