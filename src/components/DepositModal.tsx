import { useState, type FormEvent } from 'react'
import { useWallet } from '../context/useWallet'
import { parseAmount } from '../utils/amount'
import { roundMoney } from '../utils/calculations'
import { cn } from '../utils/cn'
import { todayISO } from '../utils/date'
import { formatCurrency } from '../utils/format'
import { validateAmount, validateDate } from '../utils/validation'
import { AmountInput } from './ui/AmountInput'
import { buttonClass } from './ui/buttonStyles'
import { FormField } from './ui/FormField'
import { inputClass } from './ui/inputStyles'
import { Modal } from './ui/Modal'

interface DepositModalProps {
  onClose: () => void
  onSaved: (message: string) => void
}

interface DepositErrors {
  amount?: string
  date?: string
}

// Para ekleme penceresi
export function DepositModal({ onClose, onSaved }: DepositModalProps) {
  const { addDeposit, balance } = useWallet()
  const [amountText, setAmountText] = useState('')
  const [date, setDate] = useState(todayISO())
  const [errors, setErrors] = useState<DepositErrors>({})

  const amount = parseAmount(amountText)
  const isAmountValid = !validateAmount(amountText)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: DepositErrors = {
      amount: validateAmount(amountText),
      date: validateDate(date),
    }
    setErrors(nextErrors)
    if (nextErrors.amount || nextErrors.date) return

    addDeposit({ amount, date })
    onSaved(`${formatCurrency(amount)} hesabına eklendi`)
    onClose()
  }

  return (
    <Modal
      title="Para ekle"
      description="Eklediğin tutar bakiyene yansır. Harcamaların bu bakiyeden düşer."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField
          label="Tutar"
          htmlFor="deposit-amount"
          error={errors.amount}
          hint={
            isAmountValid && (
              <>
                Yeni bakiyen:{' '}
                <span
                  className={cn(
                    'font-medium',
                    balance + amount < 0 ? 'text-red-600' : 'text-emerald-600',
                  )}
                >
                  {formatCurrency(roundMoney(balance + amount))}
                </span>
              </>
            )
          }
        >
          <AmountInput
            id="deposit-amount"
            value={amountText}
            onChange={(value) => {
              setAmountText(value)
              setErrors((current) => ({ ...current, amount: undefined }))
            }}
            error={errors.amount}
            placeholder="10.000"
            autoFocus
          />
        </FormField>

        <FormField label="Tarih" htmlFor="deposit-date" error={errors.date}>
          <input
            id="deposit-date"
            type="date"
            value={date}
            max={todayISO()}
            onChange={(event) => {
              setDate(event.target.value)
              setErrors((current) => ({ ...current, date: undefined }))
            }}
            aria-invalid={Boolean(errors.date)}
            className={inputClass(Boolean(errors.date))}
          />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className={buttonClass('secondary')} onClick={onClose}>
            Vazgeç
          </button>
          <button type="submit" className={buttonClass('primary')}>
            Para ekle
          </button>
        </div>
      </form>
    </Modal>
  )
}
