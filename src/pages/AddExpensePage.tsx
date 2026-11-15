import { useNavigate } from 'react-router'
import { ExpenseForm } from '../components/ExpenseForm'
import { useLayout } from '../components/layout/useLayout'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { useWallet } from '../context/useWallet'
import type { NewExpense } from '../interfaces/Expense'
import { getMonthKey } from '../utils/date'

// Harcama ekleme sayfası
export function AddExpensePage() {
  const { addExpense, balance } = useWallet()
  const { showToast } = useLayout()
  const navigate = useNavigate()

  function handleSubmit(data: NewExpense) {
    addExpense(data)
    showToast(`"${data.title}" kaydedildi`)
    // Harcamanın ait olduğu ayın listesine git
    navigate(`/islemler?ay=${getMonthKey(data.date)}`)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Harcama ekle"
        description="Harcamanı kategorisiyle kaydet; tutarı bakiyenden düşülür."
      />
      <Card className="sm:p-6">
        <ExpenseForm
          balanceBefore={balance}
          submitLabel="Harcamayı kaydet"
          cancelTo="/islemler"
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
