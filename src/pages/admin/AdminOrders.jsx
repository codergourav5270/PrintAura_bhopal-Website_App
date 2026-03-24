import { Download, Eye } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout.jsx'
import { formatRupee, supabase } from '../../lib/supabase'

const STATUSES = ['placed', 'processing', 'shipped', 'delivered']

function paymentLabel(o) {
  if (o.payment_method === 'cod') return 'COD'
  return o.payment_status || '—'
}

function exportCsv(rows) {
  const headers = [
    'order_number',
    'customer_name',
    'customer_email',
    'total',
    'payment_method',
    'payment_status',
    'order_status',
    'created_at',
  ]
  const escape = (v) => {
    const s = v == null ? '' : String(v)
    if (s.includes(',') || s.includes('"')) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  const lines = [
    headers.join(','),
    ...rows.map((r) =>
      headers.map((h) => escape(r[h])).join(',')
    ),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [orderStatus, setOrderStatus] = useState('')
  const [payFilter, setPayFilter] = useState('')
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    let list = [...orders]
    if (dateFrom) {
      const t = new Date(dateFrom)
      list = list.filter((o) => new Date(o.created_at) >= t)
    }
    if (dateTo) {
      const t = new Date(dateTo)
      t.setHours(23, 59, 59, 999)
      list = list.filter((o) => new Date(o.created_at) <= t)
    }
    if (orderStatus)
      list = list.filter((o) => o.order_status === orderStatus)
    if (payFilter === 'paid')
      list = list.filter((o) => o.payment_status === 'paid')
    else if (payFilter === 'pending')
      list = list.filter((o) => o.payment_status === 'pending')
    else if (payFilter === 'failed')
      list = list.filter((o) => o.payment_status === 'failed')
    else if (payFilter === 'cod')
      list = list.filter((o) => o.payment_method === 'cod')
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (o) =>
          o.order_number?.toLowerCase().includes(q) ||
          o.customer_name?.toLowerCase().includes(q)
      )
    }
    return list
  }, [orders, dateFrom, dateTo, orderStatus, payFilter, search])

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ order_status: status }).eq('id', id)
    await load()
  }

  return (
    <AdminLayout title="Orders">
      <div className="flex flex-wrap gap-3 rounded-2xl border border-border bg-card p-4">
        <div>
          <label className="text-[10px] uppercase text-[#666]">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="mt-1 block rounded-xl border border-border bg-bg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase text-[#666]">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="mt-1 block rounded-xl border border-border bg-bg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase text-[#666]">Order status</label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="mt-1 block rounded-xl border border-border bg-bg px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="placed">Placed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase text-[#666]">Payment</label>
          <select
            value={payFilter}
            onChange={(e) => setPayFilter(e.target.value)}
            className="mt-1 block rounded-xl border border-border bg-bg px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cod">COD</option>
          </select>
        </div>
        <div className="min-w-[200px] flex-1">
          <label className="text-[10px] uppercase text-[#666]">Search</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Order # or customer"
            className="mt-1 w-full rounded-xl border border-border bg-bg px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => exportCsv(filtered)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-accent px-4 font-medium text-accent hover:bg-accent/10"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-border bg-bg/80 text-[#aaaaaa]">
            <tr>
              <th className="p-3 font-medium">Order #</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Items</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium">Payment</th>
              <th className="p-3 font-medium">Order status</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-[#666]">
                  Loading…
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.id} className="border-b border-border/60">
                  <td className="p-3 font-mono text-xs text-white">
                    {o.order_number}
                  </td>
                  <td className="p-3 text-[#aaaaaa]">
                    <div>{o.customer_name}</div>
                    <div className="text-xs text-[#666]">{o.customer_email}</div>
                  </td>
                  <td className="p-3 text-[#aaaaaa]">
                    {Array.isArray(o.items) ? o.items.length : 0}
                  </td>
                  <td className="p-3 font-medium text-accent">
                    {formatRupee(o.total)}
                  </td>
                  <td className="p-3 text-[#aaaaaa]">{paymentLabel(o)}</td>
                  <td className="p-3">
                    <select
                      value={o.order_status || 'placed'}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="rounded-lg border border-border bg-bg px-2 py-2 text-xs text-white"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 text-xs text-[#666]">
                    {new Date(o.created_at).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <Link
                      to={`/admin/orders/${o.id}`}
                      className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs hover:bg-white/5"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!loading && filtered.length === 0 && (
        <p className="mt-6 text-center text-[#666]">No orders match filters.</p>
      )}
    </AdminLayout>
  )
}
