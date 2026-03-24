import { useEffect, useMemo, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout.jsx'
import { StatCard } from '../../components/admin/StatCard.jsx'
import { formatRupee, supabase } from '../../lib/supabase'

function statusColor(o) {
  if (o.payment_method === 'cod') return 'text-amber-300 bg-amber-950/30'
  if (o.payment_status === 'paid') return 'text-emerald-300 bg-emerald-950/30'
  if (o.payment_status === 'pending') return 'text-yellow-200 bg-yellow-950/30'
  if (o.payment_status === 'failed') return 'text-red-300 bg-red-950/30'
  return 'text-[#aaaaaa] bg-bg'
}

function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function startOfWeekMonday(d) {
  const x = startOfDay(d)
  const day = x.getDay()
  const diff = day === 0 ? -6 : 1 - day
  x.setDate(x.getDate() + diff)
  return x
}

export default function AdminPayments() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState('')
  const [statusF, setStatusF] = useState('')
  const [methodF, setMethodF] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (!cancelled) setOrders(data || [])
      if (!cancelled) setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const paidOrders = useMemo(
    () => orders.filter((o) => o.payment_status === 'paid'),
    [orders]
  )

  const summary = useMemo(() => {
    const now = new Date()
    const sod = startOfDay(now)
    const sow = startOfWeekMonday(now)
    const som = new Date(now.getFullYear(), now.getMonth(), 1)
    const sumRange = (list, from) =>
      list
        .filter((o) => new Date(o.created_at) >= from)
        .reduce((s, o) => s + (o.total || 0), 0)
    return {
      today: sumRange(paidOrders, sod),
      week: sumRange(paidOrders, sow),
      month: sumRange(paidOrders, som),
    }
  }, [paidOrders])

  const filtered = useMemo(() => {
    let list = [...orders]
    if (dateFrom) {
      const t = new Date(dateFrom)
      t.setHours(0, 0, 0, 0)
      list = list.filter((o) => new Date(o.created_at) >= t)
    }
    if (statusF === 'paid')
      list = list.filter((o) => o.payment_status === 'paid')
    else if (statusF === 'pending')
      list = list.filter((o) => o.payment_status === 'pending')
    else if (statusF === 'failed')
      list = list.filter((o) => o.payment_status === 'failed')
    if (methodF === 'online')
      list = list.filter((o) => o.payment_method === 'online')
    if (methodF === 'cod')
      list = list.filter((o) => o.payment_method === 'cod')
    return list
  }, [orders, dateFrom, statusF, methodF])

  return (
    <AdminLayout title="Payments">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Collected today (paid)"
          value={formatRupee(summary.today)}
          tone="green"
        />
        <StatCard
          label="This week"
          value={formatRupee(summary.week)}
          tone="blue"
        />
        <StatCard
          label="This month"
          value={formatRupee(summary.month)}
          tone="purple"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3 rounded-2xl border border-border bg-card p-4">
        <div>
          <label className="text-[10px] uppercase text-[#666]">From date</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="mt-1 block rounded-xl border border-border bg-bg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase text-[#666]">Status</label>
          <select
            value={statusF}
            onChange={(e) => setStatusF(e.target.value)}
            className="mt-1 block rounded-xl border border-border bg-bg px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase text-[#666]">Method</label>
          <select
            value={methodF}
            onChange={(e) => setMethodF(e.target.value)}
            className="mt-1 block rounded-xl border border-border bg-bg px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="online">Online</option>
            <option value="cod">COD</option>
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border bg-bg/80 text-[#aaaaaa]">
            <tr>
              <th className="p-3 font-medium">Order #</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Amount</th>
              <th className="p-3 font-medium">Method</th>
              <th className="p-3 font-medium">Razorpay ID</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center">
                  Loading…
                </td>
              </tr>
            ) : (
              filtered.map((o) => {
                const displayStatus =
                  o.payment_method === 'cod' ? 'COD (pending)' : o.payment_status
                return (
                  <tr key={o.id} className="border-b border-border/60">
                    <td className="p-3 font-mono text-xs">{o.order_number}</td>
                    <td className="p-3 text-[#aaaaaa]">{o.customer_name}</td>
                    <td className="p-3 font-medium text-accent">
                      {formatRupee(o.total)}
                    </td>
                    <td className="p-3 text-[#aaaaaa]">{o.payment_method}</td>
                    <td className="max-w-[140px] truncate p-3 text-xs text-[#666]">
                      {o.razorpay_payment_id || o.razorpay_order_id || '—'}
                    </td>
                    <td className="p-3">
                      <span
                        className={`rounded-lg px-2 py-1 text-xs ${statusColor(o)}`}
                      >
                        {displayStatus}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-[#666]">
                      {new Date(o.created_at).toLocaleString()}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
