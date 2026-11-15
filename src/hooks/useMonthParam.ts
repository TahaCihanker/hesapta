import { useSearchParams } from 'react-router'
import { getCurrentMonthKey, isValidMonthKey } from '../utils/date'

// Seçili ayı adres çubuğunda tutar (?ay=2026-10)
export function useMonthParam(): [string, (month: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams()
  const param = searchParams.get('ay') ?? ''
  const month = isValidMonthKey(param) ? param : getCurrentMonthKey()

  function setMonth(nextMonth: string) {
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current)
        params.set('ay', nextMonth)
        return params
      },
      { replace: true },
    )
  }

  return [month, setMonth]
}
