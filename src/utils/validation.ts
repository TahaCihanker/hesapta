import { parseAmount } from './amount'
import { todayISO } from './date'

// Form doğrulama: hata varsa mesaj, yoksa undefined

export function validateAmount(text: string): string | undefined {
  if (!text.trim()) return 'Bir tutar gir'
  const amount = parseAmount(text)
  if (Number.isNaN(amount)) return 'Geçerli bir tutar gir (ör. 245,50)'
  if (amount <= 0) return 'Tutar sıfırdan büyük olmalı'
  if (amount > 10_000_000) return 'Tutar en fazla ₺10.000.000 olabilir'
  return undefined
}

export function validateDate(date: string): string | undefined {
  if (!date) return 'Bir tarih seç'
  if (date > todayISO()) return 'İleri bir tarih seçilemez'
  return undefined
}
