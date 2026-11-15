import { useOutletContext } from 'react-router'

// Layout'un sayfalara sunduğu ortak işlemler
export interface LayoutContext {
  openDepositModal: () => void
  showToast: (message: string) => void
}

export function useLayout(): LayoutContext {
  return useOutletContext<LayoutContext>()
}
