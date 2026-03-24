import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout.jsx'
import { formatRupee, supabase } from '../../lib/supabase'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [c, o] = await Promise.all([
        supabase.from('customers').select('*').order('total_spent', { ascending: false }),
        supabase.from('orders').select('*'),
      ])
      if (cancelled) return
      setCustomers(c.data || [])
      setOrders(o.data || [])
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return customers
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(s) ||
        c.email?.toLowerCase().includes(s) ||
        c.phone?.toLowerCase().includes(s)
    )
  }, [customers, q])

  const ordersByEmail = useMemo(() => {
    const m = {}
    orders.forEach((o) => {
      const e = (o.customer_email || '').toLowerCase()
      if (!e) return
      if (!m[e]) m[e] = []
      m[e].push(o)
    })
    return m
  }, [orders])

  return (
    <AdminLayout title="Customers">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, phone"
          className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-border bg-bg/80 text-[#aaaaaa]">
            <tr>
              <th className="p-3 w-8" />
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Total orders</th>
              <th className="p-3 font-medium">Total spent</th>
              <th className="p-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#666]">
                  Loading…
                </td>
              </tr>
            ) : (
              filtered.map((c) => {
                const open = expanded === c.id
                const email = (c.email || '').toLowerCase()
                const custOrders = ordersByEmail[email] || []
                return (
                  <Fragment key={c.id}>
                    <tr
                      className="cursor-pointer border-b border-border/60 hover:bg-white/[0.02]"
                      onClick={() => setExpanded(open ? null : c.id)}
                    >
                      <td className="p-3 text-[#aaaaaa]">
                        {open ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </td>
                      <td className="p-3 font-medium text-white">{c.name}</td>
                      <td className="p-3 text-[#aaaaaa]">{c.email}</td>
                      <td className="p-3 text-[#aaaaaa]">{c.phone || '—'}</td>
                      <td className="p-3 text-[#aaaaaa]">{c.total_orders ?? 0}</td>
                      <td className="p-3 text-accent">
                        {formatRupee(c.total_spent ?? 0)}
                      </td>
                      <td className="p-3 text-xs text-[#666]">
                        {c.created_at
                          ? new Date(c.created_at).toLocaleDateString()
                          : '—'}
                      </td>
                    </tr>
                    {open && (
                      <tr className="bg-bg/50">
                        <td colSpan={7} className="p-4">
                          <p className="mb-2 text-xs font-semibold uppercase text-[#666]">
                            Orders for {c.email}
                          </p>
                          {custOrders.length === 0 ? (
                            <p className="text-sm text-[#666]">No linked orders.</p>
                          ) : (
                            <ul className="space-y-2">
                              {custOrders.map((o) => (
                                <li
                                  key={o.id}
                                  className="flex flex-wrap justify-between gap-2 rounded-lg border border-border px-3 py-2 text-xs text-[#aaaaaa]"
                                >
                                  <span className="font-mono text-white">
                                    {o.order_number}
                                  </span>
                                  <span>{formatRupee(o.total)}</span>
                                  <span>{o.order_status}</span>
                                  <span>
                                    {new Date(o.created_at).toLocaleDateString()}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      {!loading && filtered.length === 0 && (
        <p className="mt-6 text-center text-[#666]">No customers.</p>
      )}
    </AdminLayout>
  )
}
