import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout.jsx'
import { StatCard } from '../../components/admin/StatCard.jsx'
import { formatRupee, supabase } from '../../lib/supabase'

function startOfWeek(d) {
  const x = new Date(d)
  const day = x.getDay()
  const diff = x.getDate() - day + (day === 0 ? -6 : 1)
  x.setDate(diff)
  x.setHours(0, 0, 0, 0)
  return x
}

function formatDayLabel(d) {
  return d.toLocaleDateString('en-IN', { weekday: 'short' })
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [o, p, c] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('id,in_stock,name'),
        supabase.from('customers').select('id'),
      ])
      if (cancelled) return
      setOrders(o.data || [])
      setProducts(p.data || [])
      setCustomers(c.data || [])
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(() => {
    const paid = orders.filter((x) => x.payment_status === 'paid')
    const revenue = paid.reduce((s, x) => s + (x.total || 0), 0)
    return {
      revenue,
      orderCount: orders.length,
      productCount: products.length,
      customerCount: customers.length,
    }
  }, [orders, products, customers])

  const weekChart = useMemo(() => {
    const start = startOfWeek(new Date())
    const days = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      days.push(d)
    }
    return days.map((d) => {
      const key = d.toDateString()
      const count = orders.filter((o) => {
        const cd = new Date(o.created_at)
        return cd.toDateString() === key
      }).length
      return { name: formatDayLabel(d), orders: count }
    })
  }, [orders])

  const monthRevenueChart = useMemo(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const pts = []
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(y, m, day)
      const rev = orders
        .filter((o) => {
          if (o.payment_status !== 'paid') return false
          const cd = new Date(o.created_at)
          return (
            cd.getFullYear() === y &&
            cd.getMonth() === m &&
            cd.getDate() === day
          )
        })
        .reduce((s, x) => s + (x.total || 0), 0)
      pts.push({ name: String(day), revenue: rev })
    }
    return pts
  }, [orders])

  const recent = orders.slice(0, 5)
  const lowStock = products.filter((p) => p.in_stock === false)

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="flex h-64 items-center justify-center text-[#aaaaaa]">
          Loading…
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total revenue (paid)"
              value={formatRupee(stats.revenue)}
              tone="golden"
            />
            <StatCard
              label="Total orders"
              value={stats.orderCount}
              tone="blue"
            />
            <StatCard
              label="Total products"
              value={stats.productCount}
              tone="green"
            />
            <StatCard
              label="Total customers"
              value={stats.customerCount}
              tone="purple"
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-sm font-semibold text-white">
                Orders this week
              </h2>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: '#1a1a1a',
                        border: '1px solid #2a2a2a',
                      }}
                    />
                    <Bar dataKey="orders" fill="#f5c518" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-sm font-semibold text-white">
                Revenue this month (paid)
              </h2>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthRevenueChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        background: '#1a1a1a',
                        border: '1px solid #2a2a2a',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#f5c518"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Recent orders</h2>
                <Link
                  to="/admin/orders"
                  className="text-xs font-medium text-accent hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-[#666]">
                      <th className="pb-2 font-medium">Order</th>
                      <th className="pb-2 font-medium">Customer</th>
                      <th className="pb-2 font-medium">Amount</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((o) => (
                      <tr key={o.id} className="border-b border-border/60">
                        <td className="py-2 font-mono text-xs">
                          {o.order_number}
                        </td>
                        <td className="py-2 text-[#aaaaaa]">{o.customer_name}</td>
                        <td className="py-2 text-accent">{formatRupee(o.total)}</td>
                        <td className="py-2 text-[#aaaaaa]">{o.order_status}</td>
                        <td className="py-2 text-xs text-[#666]">
                          {new Date(o.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {recent.length === 0 && (
                  <p className="py-8 text-center text-sm text-[#666]">
                    No orders yet.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-sm font-semibold text-amber-400">
                Low stock / out of stock
              </h2>
              <div className="mt-4 space-y-3">
                {lowStock.length === 0 && (
                  <p className="text-sm text-[#666]">All products in stock ✅</p>
                )}
                {lowStock.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-sm"
                  >
                    <p className="font-medium text-white">{p.name}</p>
                    <p className="text-xs text-amber-200">Marked out of stock</p>
                    <Link
                      to={`/admin/products/edit/${p.id}`}
                      className="mt-2 inline-block text-xs text-accent hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
