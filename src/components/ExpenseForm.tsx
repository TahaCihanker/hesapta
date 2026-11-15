import { Check, TriangleAlert } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { CATEGORIES } from '../constants/categories'
import type { CategoryId } from '../interfaces/Category'
import type { NewExpense } from '../interfaces/Expense'
import { amountToInput, parseAmount } from '../utils/amount'
import { roundMoney } from '../utils/calculations'
import { cn } from '../utils/cn'
import { todayISO } from '../utils/date'
import { formatCurrency } from '../utils/format'
import { validateAmount, validateDate } from '../utils/validation'
import { CategoryIcon } from './CategoryIcon'
import { AmountInput } from './ui/AmountInput'
import { buttonClass } from './ui/buttonStyles'
import { FormField } from './ui/FormField'
import { inputClass } from './ui/inputStyles'

interface ExpenseFormProps {
  initialValues?: NewExpense
  balanceBefore: number
  submitLabel: string
  cancelTo: string
  onSubmit: (data: NewExpense) => void
}

type ExpenseErrors = Partial<
  Record<'title' | 'amount' | 'categoryId' | 'date' | 'note', string>
>

const TITLE_MAX = 60
const NOTE_MAX = 200

// Harcama formu (ekleme ve düzenleme)
export function ExpenseForm({
  initialValues,
  balanceBefore,
  submitLabel,
  cancelTo,
  onSubmit,
}: ExpenseFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [amountText, setAmountText] = useState(
    initialValues ? amountToInput(initialValues.amount) : '',
  )
  const [categoryId, setCategoryId] = useState<CategoryId | ''>(
    initialValues?.categoryId ?? '',
  )
  const [date, setDate] = useState(initialValues?.date ?? todayISO())
  const [note, setNote] = useState(initialValues?.note ?? '')
  const [errors, setErrors] = useState<ExpenseErrors>({})

  const amount = parseAmount(amountText)
  const isAmountValid = !validateAmount(amountText)
  const balanceAfter = roundMoney(balanceBefore - amount)

  function clearError(field: keyof ExpenseErrors) {
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function validate(): ExpenseErrors {
    const result: ExpenseErrors = {}
    const trimmedTitle = title.trim()
    if (!trimmedTitle) result.title = 'Harcamaya bir ad ver (ör. Migros alışverişi)'
    else if (trimmedTitle.length > TITLE_MAX)
      result.title = `Ad en fazla ${TITLE_MAX} karakter olabilir`
    result.amount = validateAmount(amountText)
    if (!categoryId) result.categoryId = 'Bir kategori seç'
    result.date = validateDate(date)
    if (note.trim().length > NOTE_MAX)
      result.note = `Not en fazla ${NOTE_MAX} karakter olabilir`
    return result
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean) || !categoryId) return

    onSubmit({
      title: title.trim(),
      amount,
      categoryId,
      date,
      note: note.trim() || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <FormField label="Harcama adı" htmlFor="expense-title" error={errors.title}>
        <input
          id="expense-title"
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            clearError('title')
          }}
          placeholder="Migros alışverişi"
          maxLength={TITLE_MAX + 20}
          autoFocus={!initialValues}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'expense-title-error' : undefined}
          className={inputClass(Boolean(errors.title))}
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Tutar" htmlFor="expense-amount" error={errors.amount}>
          <AmountInput
            id="expense-amount"
            value={amountText}
            onChange={(value) => {
              setAmountText(value)
              clearError('amount')
            }}
            error={errors.amount}
            placeholder="245,50"
          />
        </FormField>

        <FormField label="Tarih" htmlFor="expense-date" error={errors.date}>
          <input
            id="expense-date"
            type="date"
            value={date}
            max={todayISO()}
            onChange={(event) => {
              setDate(event.target.value)
              clearError('date')
            }}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? 'expense-date-error' : undefined}
            className={inputClass(Boolean(errors.date))}
          />
        </FormField>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-slate-700">Kategori</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORIES.map((category) => {
            const isSelected = categoryId === category.id
            return (
              <label
                key={category.id}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 text-sm transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-100',
                  isSelected
                    ? 'border-brand-500 bg-brand-50/60 text-slate-900'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                )}
              >
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={isSelected}
                  onChange={() => {
                    setCategoryId(category.id)
                    clearError('categoryId')
                  }}
                  className="sr-only"
                />
                <CategoryIcon icon={category.icon} color={category.color} size="sm" />
                <span className="truncate font-medium">{category.name}</span>
                {isSelected && (
                  <Check size={16} className="ml-auto shrink-0 text-brand-600" aria-hidden />
                )}
              </label>
            )
          })}
        </div>
        {errors.categoryId && (
          <p className="mt-1.5 text-xs text-red-600">{errors.categoryId}</p>
        )}
      </fieldset>

      <FormField label="Not" htmlFor="expense-note" error={errors.note} optional>
        <textarea
          id="expense-note"
          value={note}
          onChange={(event) => {
            setNote(event.target.value)
            clearError('note')
          }}
          rows={3}
          placeholder="Haftalık alışveriş"
          aria-invalid={Boolean(errors.note)}
          className={cn(inputClass(Boolean(errors.note)), 'h-auto resize-none py-2')}
        />
      </FormField>

      <div className="flex flex-col-reverse gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
        <div className="mr-auto text-sm">
          {isAmountValid ? (
            <p className="flex items-center gap-1.5 text-slate-500">
              {balanceAfter < 0 && (
                <TriangleAlert size={16} className="text-red-500" aria-hidden />
              )}
              Bu harcamadan sonra bakiyen:
              <span
                className={cn(
                  'font-semibold tabular-nums',
                  balanceAfter < 0 ? 'text-red-600' : 'text-emerald-600',
                )}
              >
                {formatCurrency(balanceAfter)}
              </span>
            </p>
          ) : (
            <p className="text-slate-400">
              Şu anki bakiyen: {formatCurrency(balanceBefore)}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link to={cancelTo} className={cn(buttonClass('secondary'), 'flex-1 sm:flex-none')}>
            Vazgeç
          </Link>
          <button type="submit" className={cn(buttonClass('primary'), 'flex-1 sm:flex-none')}>
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}
