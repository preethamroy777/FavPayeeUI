import { useEffect, useMemo, useState } from 'react'
import api from '../api.js'

function PayeesPage() {
  const [payees, setPayees] = useState([])
  const [favorites, setFavorites] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [page, setPage] = useState(1)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPayee, setNewPayee] = useState({ name: '', account: '', bank: '', country: '' })
  const [message, setMessage] = useState('')
  const pageSize = 5

  useEffect(() => {
    const load = async () => {
      const response = await api.getPayees()
      setPayees(response.payees)
      setFavorites(response.favorites)
    }
    load()
  }, [])

  const filteredPayees = useMemo(() => {
    const searchText = search.trim().toLowerCase()
    return payees
      .filter((payee) => {
        if (!searchText) return true
        return [payee.name, payee.bank, payee.country, payee.account]
          .join(' ')
          .toLowerCase()
          .includes(searchText)
      })
      .sort((a, b) => {
        if (sortBy === 'bank') return a.bank.localeCompare(b.bank)
        if (sortBy === 'country') return a.country.localeCompare(b.country)
        return a.name.localeCompare(b.name)
      })
      .slice(0, 20)
  }, [payees, search, sortBy])

  const pageCount = Math.max(1, Math.ceil(filteredPayees.length / pageSize))
  const pageItems = filteredPayees.slice((page - 1) * pageSize, page * pageSize)

  const toggleFavorite = async (id) => {
    const response = await api.toggleFavorite(id)
    setFavorites(response.favorites)
  }

  const handleAddPayee = async (event) => {
    event.preventDefault()
    const trimmed = {
      name: newPayee.name.trim(),
      account: newPayee.account.trim(),
      bank: newPayee.bank.trim(),
      country: newPayee.country.trim(),
    }
    if (!trimmed.name || !trimmed.account || !trimmed.bank || !trimmed.country) {
      setMessage('All fields are required to add a payee.')
      return
    }
    await api.addPayee(trimmed)
    const updated = await api.getPayees()
    setPayees(updated.payees)
    setFavorites(updated.favorites)
    setMessage(`Added ${trimmed.name} successfully.`)
    setNewPayee({ name: '', account: '', bank: '', country: '' })
    setShowAddForm(false)
    setPage(1)
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[32px] bg-white p-6 shadow-soft md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase text-sg-red font-semibold tracking-[0.24em]">Payee master</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">All registered payees</h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Browse payees, sort, filter and star favorites for fast payments across your Société Générale accounts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm((current) => !current)}
            className="inline-flex items-center justify-center rounded-2xl bg-sg-red px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b50016]"
          >
            {showAddForm ? 'Hide add payee' : 'Add payee'}
          </button>
        </div>

        {showAddForm && (
          <form className="mt-6 space-y-4 rounded-[28px] border border-slate-200 bg-slate-50 p-5 md:p-6" onSubmit={handleAddPayee}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm text-slate-700">
                Payee name
                <input
                  value={newPayee.name}
                  onChange={(event) => setNewPayee((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sg-red focus:ring-2 focus:ring-sg-red/20"
                  placeholder="Société Générale Paris"
                />
              </label>
              <label className="block text-sm text-slate-700">
                Account IBAN
                <input
                  value={newPayee.account}
                  onChange={(event) => setNewPayee((prev) => ({ ...prev, account: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sg-red focus:ring-2 focus:ring-sg-red/20"
                  placeholder="FR76 3000 6000 0112 3456 7890 189"
                />
              </label>
              <label className="block text-sm text-slate-700">
                Bank name
                <input
                  value={newPayee.bank}
                  onChange={(event) => setNewPayee((prev) => ({ ...prev, bank: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sg-red focus:ring-2 focus:ring-sg-red/20"
                  placeholder="Société Générale"
                />
              </label>
              <label className="block text-sm text-slate-700">
                Country
                <input
                  value={newPayee.country}
                  onChange={(event) => setNewPayee((prev) => ({ ...prev, country: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sg-red focus:ring-2 focus:ring-sg-red/20"
                  placeholder="France"
                />
              </label>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">Use this form to add a mock payee while backend integration is pending.</p>
              <button type="submit" className="inline-flex items-center justify-center rounded-2xl bg-sg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
                Save payee
              </button>
            </div>
          </form>
        )}
        {message && <p className="mt-4 text-sm text-sg-red">{message}</p>}
      </div>

      <div className="rounded-[32px] bg-white p-6 shadow-soft md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase text-sg-red font-semibold tracking-[0.24em]">Search & filters</p>
            <h3 className="text-xl font-semibold text-slate-950">Filter payees</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(200px,_1fr)_170px]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none focus:border-sg-red focus:ring-2 focus:ring-sg-red/10"
              placeholder="Search payee, bank or country"
            />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sg-red focus:ring-2 focus:ring-sg-red/10"
            >
              <option value="name">Sort by name</option>
              <option value="bank">Sort by bank</option>
              <option value="country">Sort by country</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-6 py-4">Payee</th>
                <th className="px-6 py-4">Bank</th>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">IBAN</th>
                <th className="px-6 py-4 text-right">Favorite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {pageItems.map((payee) => (
                <tr key={payee.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{payee.name}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{payee.bank}</td>
                  <td className="px-6 py-4 text-slate-600">{payee.country}</td>
                  <td className="px-6 py-4 text-slate-600">{payee.account}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(payee.id)}
                      className="inline-flex items-center justify-center rounded-full px-3 py-2 text-lg transition hover:opacity-70"
                    >
                      {favorites.includes(payee.id) ? '★' : '☆'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">Showing {pageItems.length} of {filteredPayees.length} payees.</p>
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPage(index + 1)}
                className={`rounded-full px-4 py-2 text-sm ${page === index + 1 ? 'bg-sg-black text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PayeesPage
