import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { supabase } from '../../lib/supabase'

export default function AdminCoupons() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [code, setCode] = useState('')
  const [pct, setPct] = useState('10')
  const [busy, setBusy] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const create = async () => {
    const c = code.trim().toUpperCase()
    if (!c) return
    setBusy(true)
    await supabase.from('coupons').insert({
      code: c,
      discount_percent: Math.min(100, Math.max(1, Number(pct) || 10)),
      is_active: true,
    })
    setBusy(false)
    setModal(false)
    setCode('')
    setPct('10')
    await load()
  }

  const toggle = async (id, is_active) => {
    await supabase.from('coupons').update({ is_active }).eq('id', id)
    await load()
  }

  const del = async (id) => {
    if (!window.confirm('Delete coupon?')) return
    await supabase.from('coupons').delete().eq('id', id)
    await load()
  }

  return (
    <AdminLayout title="Coupons">
      <button
        type="button"
        onClick={() => setModal(true)}
        className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-accent px-5 font-semibold text-black"
      >
        <Plus className="h-5 w-5" />
        Create coupon
      </button>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-border bg-bg/80 text-[#aaaaaa]">
            <tr>
              <th className="p-3 font-medium">Code</th>
              <th className="p-3 font-medium">Discount %</th>
              <th className="p-3 font-medium">Active</th>
              <th className="p-3 font-medium">Created</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  Loading…
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60">
                  <td className="p-3 font-mono font-semibold text-white">
                    {r.code}
                  </td>
                  <td className="p-3 text-accent">{r.discount_percent}%</td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => toggle(r.id, !r.is_active)}
                      className={`rounded-lg px-3 py-1 text-xs ${
                        r.is_active
                          ? 'bg-emerald-950/50 text-emerald-300'
                          : 'bg-white/5 text-[#666]'
                      }`}
                    >
                      {r.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-3 text-xs text-[#666]">
                    {r.created_at
                      ? new Date(r.created_at).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => del(r.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-500/40 px-3 py-2 text-xs text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="New coupon"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[#aaaaaa]">Code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="mt-1 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm uppercase"
            />
          </div>
          <div>
            <label className="text-xs text-[#aaaaaa]">Discount %</label>
            <input
              type="number"
              value={pct}
              onChange={(e) => setPct(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm"
            />
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={create}
            className="w-full rounded-xl bg-accent py-3 font-semibold text-black"
          >
            Save
          </button>
        </div>
      </Modal>
    </AdminLayout>
  )
}
