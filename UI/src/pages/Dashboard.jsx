import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../AuthContext.jsx'
import api from '../api.js'

const currency = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' })

function DashboardPage() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [payees, setPayees] = useState([])
  const [favorites, setFavorites] = useState([])
  const [page, setPage] = useState(1)
  const [isBalanceHidden, setIsBalanceHidden] = useState(false)
  const pageSize = 5

  useEffect(() => {
    const loadData = async () => {
      const accountData = await api.getAccounts()
      setAccounts(accountData.accounts)
      setTotalBalance(accountData.totalBalance)
      const payeeData = await api.getPayees()
      setPayees(payeeData.payees)
      setFavorites(payeeData.favorites)
    }
    loadData()
  }, [])

  const favoritePayees = useMemo(
    () => payees.filter((payee) => favorites.includes(payee.id)).slice(0, 20),
    [payees, favorites],
  )

  const pageCount = Math.max(1, Math.ceil(favoritePayees.length / pageSize))

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount)
    }
  }, [page, pageCount])

  const pageItems = favoritePayees.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-[1fr_auto]">
        <div className="rounded-[32px] bg-white p-6 shadow-soft md:p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-sg-red font-semibold">Dashboard</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">Hello, {user?.name || 'valued client'}</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            💳 Enjoy exclusive rates on transfers to partner networks this month. Free shipping on all retail card orders.
          </p>
        </div>

        <div className="rounded-[32px] bg-gradient-to-br from-sg-red to-[#a10015] p-6 shadow-soft text-white md:p-8 min-w-[220px]">
          <p className="text-sm uppercase tracking-[0.28em] font-semibold opacity-90">Total balance</p>
          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-bold">{isBalanceHidden ? '€ XXX.XX' : currency.format(totalBalance)}</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsBalanceHidden((prev) => !prev)}
              className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/30"
            >
              {isBalanceHidden ? 'Show' : 'Hide'}
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="rounded-[32px] bg-gradient-to-br from-yellow-50 to-amber-50 p-6 shadow-soft border-2 border-sg-red/20 md:p-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sg-red font-semibold">⭐ Favorite payees</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">Quick access</h2>
            </div>
            <div className="rounded-3xl bg-white px-4 py-2 text-sm font-semibold text-slate-800">{favoritePayees.length}</div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Nickname</th>
                  <th className="px-5 py-4">Bank</th>
                  <th className="px-5 py-4">IBAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pageItems.map((payee) => (
                  <tr key={payee.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-950 text-sm">{payee.nickName || payee.name}</td>
                    <td className="px-5 py-4 text-slate-600 text-xs">{payee.bank}</td>
                    <td className="px-5 py-4 text-slate-500 text-xs font-mono">{payee.account}</td>
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-5 py-6 text-center text-slate-500 text-sm">
                      No favorites yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPage(index + 1)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  page === index + 1 ? 'bg-sg-black text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage

