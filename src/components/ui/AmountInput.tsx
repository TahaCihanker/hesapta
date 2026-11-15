import { cn } from '../../utils/cn'
import { inputClass } from './inputStyles'

interface AmountInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  autoFocus?: boolean
}

// ₺ işaretli tutar kutusu
export function AmountInput({
  id,
  value,
  onChange,
  error,
  placeholder = '0,00',
  autoFocus = false,
}: AmountInputProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-400">
        ₺
      </span>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(inputClass(Boolean(error)), 'pl-7 tabular-nums')}
      />
    </div>
  )
}
