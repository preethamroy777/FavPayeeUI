import { BrowserRouter, Routes, Route, Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext.jsx'
import LoginPage from './pages/Login.jsx'
import DashboardPage from './pages/Dashboard.jsx'
import PayeesPage from './pages/Payees.jsx'
import SettingsPage from './pages/Settings.jsx'
import './index.css'

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

function AppShell() {
  const { isAuthenticated, user, logout } = useAuth()
  const navItems = [
    { label: 'Home', to: '/dashboard' },
    { label: 'Payees', to: '/payees' },
    { label: 'Settings', to: '/settings' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl md:px-6 md:py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sg-black text-lg font-bold text-white">SG</div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-sg-red">Société Générale</p>
            <p className="text-sm text-slate-600">Retail banking POC</p>
          </div>
        </div>

        <nav className="hidden items-center gap-5 md:flex">
          {isAuthenticated && navItems.map((item) => (
            <Link key={item.to} to={item.to} className="text-sm font-medium text-slate-700 transition hover:text-slate-950">
              {item.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-2xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-2xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Login
            </Link>
          )}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-4 pb-32 pt-6 md:px-6 md:pb-10">
        <Outlet />
      </main>

      <footer className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/98 px-4 py-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl md:hidden">
        {isAuthenticated && (
        <div className="grid grid-cols-4 gap-2 text-center text-[11px] text-slate-700">
          <Link to="/dashboard" className="rounded-3xl px-2 py-2 transition hover:bg-slate-100">
            Home
          </Link>
          <Link to="/dashboard" className="rounded-3xl px-2 py-2 transition hover:bg-slate-100">
            Transfer
          </Link>
          <Link to="/payees" className="rounded-3xl px-2 py-2 transition hover:bg-slate-100">
            Payees
          </Link>
          <Link to="/settings" className="rounded-3xl px-2 py-2 transition hover:bg-slate-100">
            Settings
          </Link>
        </div>
        )}
      </footer>
    </div>
  )
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route element={<AppShell />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/payees" element={<RequireAuth><PayeesPage /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
