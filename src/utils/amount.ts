// Yazılan tutarı sayıya çevirir: "1.250,75" → 1250.75
export function parseAmount(input: string): number {
  let value = input.trim().replace(/\s|₺|tl/gi, '')

  if (value.includes(',')) {
    // Virgül ondalık, nokta binlik ayracı
    value = value.replace(/\./g, '').replace(',', '.')
  } else if (/^\d{1,3}(\.\d{3})+$/.test(value)) {
    value = value.replace(/\./g, '')
  }

  // En fazla 2 ondalık basamaklı pozitif sayı olmalı
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return NaN
  return Number(value)
}

// Düzenleme formunda göstermek için: 245.5 → "245,50"
export function amountToInput(amount: number): string {
  return amount.toFixed(2).replace('.', ',')
}
