import type { LucideIcon } from 'lucide-react'

// Kategori kimlikleri
export type CategoryId =
  | 'groceries'
  | 'bills'
  | 'transport'
  | 'food'
  | 'entertainment'
  | 'health'
  | 'clothing'
  | 'other'

// Grafik grupları: 4 ana kategori + Diğer
export type ChartGroupId = 'groceries' | 'bills' | 'food' | 'transport' | 'other'

export interface Category {
  id: CategoryId
  name: string
  icon: LucideIcon
  color: string
  chartGroup: ChartGroupId
}

export interface ChartGroup {
  id: ChartGroupId
  name: string
  color: string
}
