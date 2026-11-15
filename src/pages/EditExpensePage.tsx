import { SearchX, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ExpenseForm } from '../components/ExpenseForm'
import { useLayout } from '../components/layout/useLayout'
import { buttonClass } from '../components/ui/buttonStyles'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { useWallet } from '../context/useWallet'
import type { NewExpense } from '../interfaces/Expense'
import { roundMoney } from '../utils/calculations'
import { getMonthKey } from '../utils/date'
import { formatCurrency } from '../utils/format'

// Harcama düzenleme sayfası
export function EditExpensePage() {
  const { id } = useParams()
  const { expenses, balance, updateExpense, deleteExpense } = useWallet()
  const { showToast } = useLayout()
  const navigate = useNavigate()
  const [isDeleteOpen, setDeleteOpen] = useState(false)

  const expense = expenses.find((item) => item.id === id)

  if (!expense) {
    return (
      <Card>
        <EmptyState
          icon={SearchX}
          title="Harcama bulunamadı"
          description="Bu harcama silinmiş ya da bağlantı hatalı olabilir."
          action={
            <Link to="/islemler" className={buttonClass('primary')}>
              İşlemlere dön
            </Link>
          }
        />
      </Card>
    )
  }

  const listUrl = `/islemler?ay=${getMonthKey(expense.date)}`

  function handleSubmit(data: NewExpense) {
    if (!expense) return
    updateExpense(expense.id, data)
    showToast(`"${data.title}" güncellendi`)
    navigate(`/islemler?ay=${getMonthKey(data.date)}`)
  }

  function handleDelete() {
    if (!expense) return
    deleteExpense(expense.id)
    showToast(`"${expense.title}" silindi`)
    navigate(listUrl)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Harcamayı düzenle"
        description={`"${expense.title}" kaydını güncelliyorsun.`}
        actions={
          <button
            type="button"
            className={buttonClass('secondary') + ' text-red-600 hover:bg-red-50 hover:text-red-700'}
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 size={16} aria-hidden />
            Sil
          </button>
        }
      />
      <Card className="sm:p-6">
        <ExpenseForm
          key={expense.id}
          initialValues={{
            title: expense.title,
            amount: expense.amount,
            categoryId: expense.categoryId,
            date: expense.date,
            note: expense.note,
          }}
          // Bu harcamanın eski tutarı bakiyeye geri eklenir
          balanceBefore={roundMoney(balance + expense.amount)}
          submitLabel="Değişiklikleri kaydet"
          cancelTo={listUrl}
          onSubmit={handleSubmit}
        />
      </Card>

      {isDeleteOpen && (
        <ConfirmDialog
          title="Harcamayı sil"
          description={`"${expense.title}" (${formatCurrency(expense.amount)}) kalıcı olarak silinecek ve tutarı bakiyene geri eklenecek.`}
          confirmLabel="Sil"
          onConfirm={handleDelete}
          onCancel={() => setDeleteOpen(false)}
        />
      )}
    </div>
  )
}
