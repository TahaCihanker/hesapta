import { CircleCheck, X } from 'lucide-react'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  onClose: () => void
}

// Kısa süreli bilgi mesajı
export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3500)
    return () => window.clearTimeout(timer)
  }, [onClose])

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg sm:right-6 sm:bottom-6 sm:left-auto sm:mx-0"
    >
      <CircleCheck size={18} className="shrink-0 text-emerald-400" aria-hidden />
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Kapat"
        className="cursor-pointer text-slate-400 hover:text-white"
      >
        <X size={16} aria-hidden />
      </button>
    </div>
  )
}
