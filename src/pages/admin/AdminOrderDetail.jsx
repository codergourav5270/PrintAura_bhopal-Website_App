import { Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout.jsx'
import { formatRupee, supabase } from '../../lib/supabase'

const STEPS = ['placed', 'processing', 'shipped', 'delivered']

export default function AdminOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState({})

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!id) return
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (cancelled) return
      if (error || !data) setOrder(null)
      else setOrder(data)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!order?.items?.length) return
      const ids = [
        ...new Set(order.items.map((i) => i.product_id).filter(Boolean)),
      ]
      if (!ids.length) return
      const { data } = await supabase
        .from('products')
        .select('id,image_url')
        .in('id', ids)
      if (cancelled) return
      const map = {}
      ;(data || []).forEach((p) => {
        map[p.id] = p.image_url
      })
      setImages(map)
    })()
    return () => {
      cancelled = true
    }
  }, [order])

  const idx = STEPS.indexOf(order?.order_status || 'placed')

  const printInvoice = () => window.print()

  const updateStatus = async (status) => {
    if (!order) return
    await supabase.from('orders').update({ order_status: status }).eq('id', order.id)
    setOrder({ ...order, order_status: status })
  }

  if (loading) {
    return (
      <AdminLayout title="Order">
        <p className="text-[#aaaaaa]">Loading…</p>
      </AdminLayout>
    )
  }

  if (!order) {
    return (
      <AdminLayout title="Order">
        <p className="text-red-300">Order not found.</p>
        <Link to="/admin/orders" className="mt-4 inline-block text-accent">
          Back
        </Link>
      </AdminLayout>
    )
  }

  const addr = order.delivery_address || {}

  return (
    <AdminLayout title={`Order ${order.order_number}`}>
      <div className="no-print mb-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={printInvoice}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-accent px-5 font-semibold text-black"
        >
          <Printer className="h-4 w-4" />
          Print invoice
        </button>
        <select
          value={order.order_status}
          onChange={(e) => updateStatus(e.target.value)}
          className="rounded-xl border border-border bg-card px-4 py-2 text-sm"
        >
          {STEPS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border border-border px-4 py-2 text-sm"
        >
          Back
        </button>
      </div>

      <div className="mb-8 hidden text-center print:block">
        <h1 className="text-2xl font-bold text-black">Poster Galaxy — Invoice</h1>
        <p className="text-sm text-gray-600">{order.order_number}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-white">Customer</h2>
          <p className="mt-2 text-[#aaaaaa]">{order.customer_name}</p>
          <p className="text-sm text-[#666]">{order.customer_email}</p>
          <p className="text-sm text-[#666]">{order.customer_phone}</p>
          <h3 className="mt-6 text-sm font-semibold text-white">Delivery</h3>
          <p className="mt-2 text-sm text-[#aaaaaa]">
            {addr.line1}
            <br />
            {addr.city}, {addr.state} — {addr.pincode}
          </p>
          <h3 className="mt-6 text-sm font-semibold text-white">Items</h3>
          <ul className="mt-3 space-y-3">
            {(order.items || []).map((it, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-border bg-bg/60 p-3"
              >
                <img
                  src={
                    images[it.product_id] ||
                    'https://placehold.co/80x107/1a1a1a/ffffff'
                  }
                  alt=""
                  className="h-16 w-12 rounded object-cover"
                />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-medium text-white">{it.name}</p>
                  <p className="text-[#666]">
                    {it.size} × {it.qty}
                  </p>
                  <p className="text-accent">{formatRupee(it.price * it.qty)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-white">Totals</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between text-[#aaaaaa]">
                <dt>Subtotal</dt>
                <dd>{formatRupee(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-[#aaaaaa]">
                <dt>Discount</dt>
                <dd>{formatRupee(order.discount)}</dd>
              </div>
              <div className="flex justify-between text-[#aaaaaa]">
                <dt>Shipping</dt>
                <dd>{formatRupee(order.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-semibold text-white">
                <dt>Total</dt>
                <dd className="text-accent">{formatRupee(order.total)}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-white">Payment</h2>
            <p className="mt-2 text-sm text-[#aaaaaa]">
              Method: {order.payment_method}
            </p>
            <p className="text-sm text-[#aaaaaa]">
              Status: {order.payment_status}
            </p>
            {order.razorpay_order_id && (
              <p className="mt-1 break-all text-xs text-[#666]">
                Rzp order: {order.razorpay_order_id}
              </p>
            )}
            {order.razorpay_payment_id && (
              <p className="break-all text-xs text-[#666]">
                Rzp payment: {order.razorpay_payment_id}
              </p>
            )}
            {order.coupon_used && (
              <p className="mt-2 text-xs text-accent">Coupon: {order.coupon_used}</p>
            )}
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-white">Timeline</h2>
            <ol className="mt-4 space-y-3">
              {STEPS.map((s, i) => (
                <li key={s} className="flex gap-3 text-sm">
                  <span
                    className={`mt-0.5 h-3 w-3 shrink-0 rounded-full ${
                      i <= idx ? 'bg-accent' : 'bg-[#333]'
                    }`}
                  />
                  <span className={i <= idx ? 'text-white' : 'text-[#666]'}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
