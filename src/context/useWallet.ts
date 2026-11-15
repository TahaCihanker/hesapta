import { useContext } from 'react'
import { WalletContext, type WalletContextValue } from './WalletContext'

// Cüzdan verisine ulaşmak için hook
export function useWallet(): WalletContextValue {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet, WalletProvider içinde kullanılmalı')
  }
  return context
}
