import { cn } from '../../utils/cn'

// Giriş alanları için ortak görünüm
export function inputClass(hasError = false): string {
  return cn(
    'h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-xs outline-none transition placeholder:text-slate-400 focus:ring-4',
    hasError
      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
      : 'border-slate-200 focus:border-brand-400 focus:ring-brand-100',
  )
}
