import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout.jsx'

const KEY = 'poster_galaxy_store_settings_v1'

function loadSettings() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { storeName: 'PrintAura_bhopal', supportEmail: 'printaura999@gmail.com' }
    return { ...JSON.parse(raw) }
  } catch {
    return { storeName: 'PrintAura_bhopal', supportEmail: 'printaura999@gmail.com' }
  }
}

export default function AdminSettings() {
  const [storeName, setStoreName] = useState('')
  const [supportEmail, setSupportEmail] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const s = loadSettings()
    setStoreName(s.storeName || '')
    setSupportEmail(s.supportEmail || '')
  }, [])

  const save = () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ storeName, supportEmail })
    )
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AdminLayout title="Settings">
      <div className="max-w-lg space-y-4 rounded-2xl border border-border bg-card p-6">
        <p className="text-sm text-[#aaaaaa]">
          Store settings are saved in this browser (localStorage). Use for display
          copy or internal notes — Supabase project URLs stay in env vars.
        </p>
        <div>
          <label className="text-xs text-[#aaaaaa]">Store name</label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-[#aaaaaa]">Support email (display)</label>
          <input
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={save}
          className="min-h-[48px] rounded-xl bg-accent px-6 font-semibold text-black"
        >
          Save settings
        </button>
        {saved && (
          <p className="text-sm text-emerald-400">Saved locally.</p>
        )}
      </div>
    </AdminLayout>
  )
}
