import { useAuth } from '../AuthContext.jsx'

function SettingsPage() {
  const { user } = useAuth()

  return (
    <section className="rounded-[32px] bg-white p-6 shadow-soft md:p-8">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm uppercase text-sg-red font-semibold tracking-[0.24em]">Settings</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">User profile & security</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Manage your mock Société Générale retail banking session and review account access details.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Account holder</p>
            <p className="mt-3 text-sm text-slate-600">{user?.name}</p>
            <p className="mt-1 text-sm text-slate-600">{user?.email}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Role</p>
            <p className="mt-3 text-sm text-slate-600">{user?.role || 'Retail user'}</p>
            <p className="mt-1 text-sm text-slate-600">Session persistence is enabled in browser storage.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SettingsPage
