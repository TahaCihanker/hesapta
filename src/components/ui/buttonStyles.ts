import { cn } from '../../utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'icon'

const base =
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-40'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white shadow-xs hover:bg-brand-700',
  secondary:
    'border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900',
  ghost: 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
  danger: 'bg-red-600 text-white shadow-xs hover:bg-red-700',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3',
  md: 'h-10 px-4',
  icon: 'h-9 w-9',
}

// Ortak buton görünümü
export function buttonClass(
  variant: ButtonVariant = 'secondary',
  size: ButtonSize = 'md',
): string {
  return cn(base, variants[variant], sizes[size])
}
