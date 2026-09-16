import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useAppSelector } from './app/hooks'
import { MainLayout } from './components/layout/MainLayout'
import { AuthPage } from './features/auth/AuthPages'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { FinancialsPage } from './features/dashboard/FinancialsPage'
import { EarningsPage } from './features/earnings/EarningsPage'
import { ExpensesPage } from './features/expenses/ExpensesPage'
import { InvestmentsPage } from './features/investments/InvestmentsPage'
import { LoansPage } from './features/loans/LoansPage'
import { ProfilePage } from './features/profile/ProfilePage'

function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const location = useLocation()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />
}

function App() {
  return <Routes>
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/register" element={<AuthPage mode="register" />} />
    <Route element={<ProtectedRoute />}><Route element={<MainLayout />}><Route index element={<DashboardPage />} /><Route path="investments" element={<InvestmentsPage />} /><Route path="earnings" element={<EarningsPage />} /><Route path="expenses" element={<ExpensesPage />} /><Route path="loans" element={<LoansPage />} /><Route path="financials" element={<FinancialsPage />} /><Route path="profile" element={<ProfilePage />} /></Route></Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}

export default App
