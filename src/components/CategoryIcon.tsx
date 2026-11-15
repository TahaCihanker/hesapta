import type { LucideIcon } from 'lucide-react'
import { cn } from '../utils/cn'

interface CategoryIconProps {
  icon: LucideIcon
  color: string
  size?: 'sm' | 'md'
}

// Renkli zeminli kategori ikonu
export function CategoryIcon({ icon: Icon, color, size = 'md' }: CategoryIconProps) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center',
        size === 'sm' ? 'h-8 w-8 rounded-lg' : 'h-10 w-10 rounded-xl',
      )}
      // "1a" = %10 saydamlık
      style={{ backgroundColor: `${color}1a`, color }}
    >
      <Icon size={size === 'sm' ? 16 : 18} aria-hidden />
    </span>
  )
}
