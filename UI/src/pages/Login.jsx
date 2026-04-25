import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

const QUICK_USERS = [
  { email: 'user1@societegenerale.eu', password: 'SG1234!', label: 'Claire Dubois' },
  { email: 'user2@societegenerale.eu', password: 'SG4321!', label: 'Antoine Martin' },
]

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await auth.login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.')
    }
  }

  const handleQuickLogin = async (option) => {
    setError('')
    try {
      await auth.login(option)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.')
    }
  }

  return (
    <div className="min-h-[calc(100vh-96px)] bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:gap-10">
        <div className="rounded-[38px] bg-[#fff4f4] p-8 shadow-soft border border-slate-200 md:p-12">
          <span className="inline-flex rounded-full bg-sg-red px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white">
            Société Générale
          </span>
          <h1 className="mt-8 text-4xl font-semibold text-slate-950">Retail banking login</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
            Sign in to the Societe Generale POC for retail financial services. Your session is kept locally while the backend is under development.
          </p>
          <div className="mt-10 rounded-[28px] bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-sm font-semibold text-slate-900">Demo details</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• Two hardcoded users are available below.</li>
              <li>• Favorite payees, accounts, and pagination are mock-powered.</li>
              <li>• Session persistence works in browser storage.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-[38px] bg-white p-8 shadow-soft border border-slate-200 md:p-12">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-sg-red">Secure access</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Sign in to your account</h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-700">
              Username
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="user1@societegenerale.eu"
                autoComplete="email"
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sg-red focus:ring-2 focus:ring-sg-red/10"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sg-red focus:ring-2 focus:ring-sg-red/10"
              />
            </label>

            {error && <div className="rounded-3xl border border-sg-red/20 bg-red-50 px-4 py-3 text-sm text-sg-red">{error}</div>}

            <button
              type="submit"
              className="w-full rounded-3xl bg-sg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              Continue
            </button>
          </form>

          <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Quick login options</p>
            <p className="mt-2 text-sm text-slate-600">Use one of the mock retail users below for fast access.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {QUICK_USERS.map((option) => (
                <button
                  key={option.email}
                  type="button"
                  onClick={() => handleQuickLogin(option)}
                  className="overflow-hidden rounded-3xl border border-slate-300 bg-white px-3 py-3 text-left text-xs font-medium text-slate-900 transition hover:border-sg-red hover:bg-slate-50"
                >
                  <span className="block font-semibold text-sm truncate">{option.label}</span>
                  <span className="mt-1 block text-xs text-slate-500 truncate">{option.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
