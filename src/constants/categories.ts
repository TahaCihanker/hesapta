import {
  Bus,
  Clapperboard,
  HeartPulse,
  Package,
  Receipt,
  Shirt,
  ShoppingCart,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react'
import type {
  Category,
  CategoryId,
  ChartGroup,
} from '../interfaces/Category'

// Sabit kategoriler
export const CATEGORIES: Category[] = [
  { id: 'groceries', name: 'Market', icon: ShoppingCart, color: '#4f46e5', chartGroup: 'groceries' },
  { id: 'bills', name: 'Fatura', icon: Receipt, color: '#0d9488', chartGroup: 'bills' },
  { id: 'transport', name: 'Ulaşım', icon: Bus, color: '#0284c7', chartGroup: 'transport' },
  { id: 'food', name: 'Yeme-İçme', icon: UtensilsCrossed, color: '#8b5cf6', chartGroup: 'food' },
  { id: 'entertainment', name: 'Eğlence', icon: Clapperboard, color: '#db2777', chartGroup: 'other' },
  { id: 'health', name: 'Sağlık', icon: HeartPulse, color: '#059669', chartGroup: 'other' },
  { id: 'clothing', name: 'Giyim', icon: Shirt, color: '#d97706', chartGroup: 'other' },
  { id: 'other', name: 'Diğer', icon: Package, color: '#64748b', chartGroup: 'other' },
]

// Grafik grupları ve renkleri
export const CHART_GROUPS: ChartGroup[] = [
  { id: 'groceries', name: 'Market', color: '#4f46e5' },
  { id: 'bills', name: 'Fatura', color: '#14b8a6' },
  { id: 'food', name: 'Yeme-İçme', color: '#a78bfa' },
  { id: 'transport', name: 'Ulaşım', color: '#0284c7' },
  { id: 'other', name: 'Diğer', color: '#94a3b8' },
]

// Para girişlerinin görünümü
export const DEPOSIT_APPEARANCE = {
  name: 'Para girişi',
  icon: Wallet,
  color: '#059669',
}

// Kategori bulunamazsa "Diğer" döner
export function getCategory(id: CategoryId): Category {
  return (
    CATEGORIES.find((category) => category.id === id) ??
    CATEGORIES[CATEGORIES.length - 1]
  )
}
