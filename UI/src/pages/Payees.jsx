import { useEffect, useMemo, useRef, useState } from 'react'
import api from '../api.js'

const BANK_GROUPS = [
  {
    label: 'European Banks',
    banks: [
      'Société Générale', 'BNP Paribas', 'Deutsche Bank', 'Commerzbank',
      'HypoVereinsbank', 'Barclays', 'HSBC UK', 'NatWest', 'Lloyds Bank',
      'Santander', 'Banco Santander', 'BBVA', 'CaixaBank', 'Crédit Agricole',
      'Natixis', 'ING Bank', 'Rabobank', 'ABN AMRO', 'BNP Paribas Fortis',
      'KBC Bank', 'UniCredit', 'Intesa Sanpaolo', 'Mediobanca', 'Nordea',
      'SEB', 'Swedbank', 'Handelsbanken', 'DNB Bank', 'Erste Bank',
      'Raiffeisen Bank', 'CGD', 'Millennium BCP', 'PKO Bank Polski',
      'mBank', 'OTP Bank', 'UBS', 'Credit Suisse', 'Julius Baer',
    ],
  },
  {
    label: 'Indian Banks',
    banks: [
      'State Bank of India', 'Bank of Baroda', 'Bank of India',
      'Punjab National Bank', 'Canara Bank', 'Union Bank of India',
      'Indian Bank', 'Central Bank of India', 'HDFC Bank', 'ICICI Bank',
      'Axis Bank', 'Kotak Mahindra Bank', 'IndusInd Bank', 'Yes Bank',
      'IDFC First Bank', 'Federal Bank', 'South Indian Bank',
      'Karnataka Bank', 'City Union Bank', 'RBL Bank',
    ],
  },
]

function validatePayee({ name, account, bank }) {
  const errors = {}
  if (!name.trim()) {
    errors.name = 'Payee name is required.'
  } else if (name.trim().length < 2) {
    errors.name = 'Payee name must be at least 2 characters.'
  }
  const ibanRaw = account.replace(/\s/g, '').toUpperCase()
  if (!ibanRaw) {
    errors.account = 'IBAN is required.'
  } else if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/.test(ibanRaw)) {
    errors.account = 'Enter a valid IBAN (e.g. GB29 NWBK 6016 1331 9268 19).'
  }
  if (!bank) {
    errors.bank = 'Please select a bank.'
  }
  return errors
}

function FieldError({ message }) {
  if (!message) return null
  return <p className="mt-1.5 text-xs text-red-500">{message}</p>
}

function BankDropdown({ value, onChange, error }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    if (open) searchRef.current?.focus()
  }, [open])

  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return BANK_GROUPS
    return BANK_GROUPS.map((group) => ({
      ...group,
      banks: group.banks.filter((b) => b.toLowerCase().includes(q)),
    })).filter((group) => group.banks.length > 0)
  }, [query])

  const select = (bank) => {
    onChange(bank)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className="relative mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition
          ${open ? 'border-sg-red ring-2 ring-sg-red/20' : error ? 'border-red-400 ring-2 ring-red-200' : 'border-slate-300'}
          ${value ? 'text-slate-900' : 'text-slate-400'}`}
      >
        <span className="truncate">{value || 'Select a bank'}</span>
        <svg
          className={`ml-2 h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
              <svg className="h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search banks…"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filteredGroups.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-slate-400">No record found</p>
            )}
            {filteredGroups.map((group) => (
              <div key={group.label}>
                <div className="sticky top-0 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 border-b border-slate-100">
                  {group.label}
                </div>
                {group.banks.map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => select(bank)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-slate-50
                      ${value === bank ? 'bg-sg-red/5 text-sg-red font-semibold' : 'text-slate-700'}`}
                  >
                    {value === bank && (
                      <svg className="h-4 w-4 shrink-0 text-sg-red" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={value === bank ? '' : 'ml-7'}>{bank}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const EMPTY_PAYEE = { name: '', nickName: '', account: '', bank: '' }

function PayeesPage() {
  const [payees, setPayees] = useState([])
  const [favorites, setFavorites] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [page, setPage] = useState(1)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPayee, setNewPayee] = useState(EMPTY_PAYEE)
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [togglingId, setTogglingId] = useState(null)
  const [toggleNotification, setToggleNotification] = useState(null)
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
        return [payee.name, payee.bank, payee.account]
          .join(' ')
          .toLowerCase()
          .includes(searchText)
      })
      .sort((a, b) => {
        if (sortBy === 'bank') return a.bank.localeCompare(b.bank)
        return a.name.localeCompare(b.name)
      })
      .slice(0, 20)
  }, [payees, search, sortBy])

  const pageCount = Math.max(1, Math.ceil(filteredPayees.length / pageSize))
  const pageItems = filteredPayees.slice((page - 1) * pageSize, page * pageSize)

  const showToggleNotification = (type, message) => {
    setToggleNotification({ type, message })
    setTimeout(() => setToggleNotification(null), 3000)
  }

  const toggleFavorite = async (id) => {
    if (togglingId !== null) return
    setTogglingId(id)
    const wasFavorite = favorites.includes(id)
    try {
      const response = await api.toggleFavorite(id)
      setFavorites(response.favorites)
      const payee = payees.find((p) => p.id === id)
      const name = payee?.nickName || payee?.name || 'Payee'
      showToggleNotification('success', wasFavorite ? `${name} removed from favorites.` : `${name} added to favorites.`)
    } catch {
      showToggleNotification('error', 'Could not update favorite. Please try again.')
    } finally {
      setTogglingId(null)
    }
  }

  const handleFieldBlur = (field) => {
    const errors = validatePayee(newPayee)
    setFieldErrors((prev) => ({ ...prev, [field]: errors[field] }))
  }

  const handleAddPayee = async (event) => {
    event.preventDefault()
    setServerError('')
    const errors = validatePayee(newPayee)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    try {
      const trimmed = {
        name: newPayee.name.trim(),
        nickName: newPayee.nickName.trim() || newPayee.name.trim(),
        account: newPayee.account.trim(),
        bank: newPayee.bank,
      }
      await api.addPayee(trimmed)
      const updated = await api.getPayees()
      setPayees(updated.payees)
      setFavorites(updated.favorites)
      setSuccessMessage(`${trimmed.name} added successfully.`)
      setTimeout(() => setSuccessMessage(''), 3000)
      setNewPayee(EMPTY_PAYEE)
      setFieldErrors({})
      setShowAddForm(false)
      setPage(1)
    } catch (err) {
      const msg = err?.message || 'Something went wrong. Please try again.'
      setServerError(msg)
      setTimeout(() => setServerError(''), 3000)
    }
  }

  const inputClass = (field) =>
    `mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition
    ${fieldErrors[field] ? 'border-red-400 ring-2 ring-red-200 focus:border-red-400' : 'border-slate-300 focus:border-sg-red focus:ring-2 focus:ring-sg-red/20'}`

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
            onClick={() => {
              setShowAddForm((current) => !current)
              setFieldErrors({})
              setServerError('')
              setNewPayee(EMPTY_PAYEE)
            }}
            className="inline-flex items-center justify-center rounded-2xl bg-sg-red px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b50016]"
          >
            {showAddForm ? 'Cancel' : 'Add payee'}
          </button>
        </div>

        {successMessage && !showAddForm && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-green-50 border border-green-200 px-4 py-3">
            <svg className="h-4 w-4 shrink-0 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {showAddForm && (
          <form className="mt-6 space-y-4 rounded-[28px] border border-slate-200 bg-slate-50 p-5 md:p-6" onSubmit={handleAddPayee} noValidate>

            {serverError && (
              <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 px-4 py-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600">{serverError}</p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-700">
                  Payee name <span className="text-red-500">*</span>
                  <input
                    value={newPayee.name}
                    onChange={(e) => setNewPayee((prev) => ({ ...prev, name: e.target.value }))}
                    onBlur={() => handleFieldBlur('name')}
                    className={inputClass('name')}
                    placeholder="Société Générale Paris"
                  />
                </label>
                <FieldError message={fieldErrors.name} />
              </div>

              <div>
                <label className="block text-sm text-slate-700">
                  Nickname
                  <input
                    value={newPayee.nickName}
                    onChange={(e) => setNewPayee((prev) => ({ ...prev, nickName: e.target.value }))}
                    className={inputClass('nickName')}
                    placeholder="SG Paris"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm text-slate-700">
                  Account IBAN <span className="text-red-500">*</span>
                  <input
                    value={newPayee.account}
                    onChange={(e) => setNewPayee((prev) => ({ ...prev, account: e.target.value }))}
                    onBlur={() => handleFieldBlur('account')}
                    className={inputClass('account')}
                    placeholder="FR76 3000 6000 0112 3456 7890 189"
                  />
                </label>
                <FieldError message={fieldErrors.account} />
              </div>

              <div>
                <label className="block text-sm text-slate-700">
                  Bank name <span className="text-red-500">*</span>
                  <BankDropdown
                    value={newPayee.bank}
                    onChange={(bank) => {
                      setNewPayee((prev) => ({ ...prev, bank }))
                      setFieldErrors((prev) => ({ ...prev, bank: undefined }))
                    }}
                    error={fieldErrors.bank}
                  />
                </label>
                <FieldError message={fieldErrors.bank} />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">Fields marked <span className="text-red-500">*</span> are required.</p>
              <button type="submit" className="inline-flex items-center justify-center rounded-2xl bg-sg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
                Save payee
              </button>
            </div>
          </form>
        )}
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
              placeholder="Search payee, bank or IBAN"
            />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sg-red focus:ring-2 focus:ring-sg-red/10"
            >
              <option value="name">Sort by name</option>
              <option value="bank">Sort by bank</option>
            </select>
          </div>
        </div>

        {toggleNotification && (
          <div className={`mt-4 flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all
            ${toggleNotification.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'}`}
          >
            {toggleNotification.type === 'success' ? (
              <svg className="h-4 w-4 shrink-0 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            )}
            <p className={`text-sm ${toggleNotification.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
              {toggleNotification.message}
            </p>
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-6 py-4">Payee</th>
                <th className="px-6 py-4">Bank</th>
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
                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">{payee.account}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(payee.id)}
                      disabled={togglingId !== null}
                      className="inline-flex items-center justify-center rounded-full px-3 py-2 text-lg transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {togglingId === payee.id ? (
                        <svg className="h-5 w-5 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                      ) : (
                        favorites.includes(payee.id) ? '★' : '☆'
                      )}
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
