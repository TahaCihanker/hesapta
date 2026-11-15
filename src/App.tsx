import { Route, Routes } from 'react-router'
import { Layout } from './components/layout/Layout'
import { AddExpensePage } from './pages/AddExpensePage'
import { DashboardPage } from './pages/DashboardPage'
import { EditExpensePage } from './pages/EditExpensePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { TransactionsPage } from './pages/TransactionsPage'

// Sayfa yönlendirmeleri
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="islemler" element={<TransactionsPage />} />
        <Route path="harcama/yeni" element={<AddExpensePage />} />
        <Route path="harcama/:id/duzenle" element={<EditExpensePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
