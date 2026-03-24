import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { Navbar } from '../../components/layout/Navbar.jsx'
import { ToastHost } from '../../components/ui/Toast.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useToast } from '../../hooks/useToast.js'
import {
  createRazorpayOrderServer,
  loadRazorpayScript,
  openRazorpayCheckout,
} from '../../lib/razorpay.js'
import { generateOrderNumber, formatRupee, supabase } from '../../lib/supabase'
import {
  getStoredCoupon,
  setStoredCoupon,
} from '../../lib/couponStorage.js'
import {
  upsertCustomerRecord,
  validateCouponCode,
} from '../../lib/ordersApi.js'

const FREE_SHIP_THRESHOLD = 499

function buildItems(cartItems) {
  return cartItems.map((x) => ({
    product_id: x.productId,
    name: x.name,
    size: x.size,
    qty: x.qty,
    price: x.price,
  }))
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCart()
  const { toast, showToast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [line1, setLine1] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [payment, setPayment] = useState('online')
  const [couponInput, setCouponInput] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponUsed, setCouponUsed] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const s = getStoredCoupon()
    if (s) {
      setDiscount(s.percent)
      setCouponUsed(s.code)
      setCouponInput(s.code)
    }
  }, [])

  const afterDiscount = subtotal - Math.round((subtotal * discount) / 100)
  const shipping =
    subtotal === 0 ? 0 : afterDiscount >= FREE_SHIP_THRESHOLD ? 0 : 79
  const discounted = Math.round((subtotal * discount) / 100)
  const total = Math.max(0, subtotal - discounted + shipping)

  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || ''

  const applyCoupon = async () => {
    const res = await validateCouponCode(couponInput)
    if (!res.ok) {
      showToast(res.error, 'error')
      setDiscount(0)
      setCouponUsed('')
      return
    }
    setDiscount(res.percent)
    setCouponUsed(res.coupon.code)
    setStoredCoupon({ code: res.coupon.code, percent: res.percent })
    showToast(`Coupon applied: ${res.percent}% off`)
  }

  const delivery = useMemo(
    () => ({
      line1,
      city,
      state,
      pincode,
    }),
    [line1, city, state, pincode]
  )

  const placeOrder = async () => {
    if (!items.length) {
      showToast('Cart is empty', 'error')
      return
    }
    if (!name.trim() || !email.trim() || !phone.trim()) {
      showToast('Please fill name, email and phone', 'error')
      return
    }
    if (!line1.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      showToast('Please complete address', 'error')
      return
    }

    const orderNumber = generateOrderNumber()
    const orderItems = buildItems(items)
    const payload = {
      order_number: orderNumber,
      customer_name: name.trim(),
      customer_email: email.trim().toLowerCase(),
      customer_phone: phone.trim(),
      delivery_address: delivery,
      items: orderItems,
      subtotal,
      discount: discounted,
      shipping,
      total,
      payment_method: payment === 'cod' ? 'cod' : 'online',
      payment_status: 'pending',
      razorpay_order_id: null,
      razorpay_payment_id: null,
      order_status: 'placed',
      coupon_used: couponUsed || null,
    }

    setBusy(true)

    if (payment === 'cod') {
      const { data, error } = await supabase.from('orders').insert(payload).select('id').single()
      if (error) {
        showToast(error.message || 'Order failed', 'error')
        setBusy(false)
        return
      }
      await upsertCustomerRecord({
        name: payload.customer_name,
        email: payload.customer_email,
        phone: payload.customer_phone,
        orderTotal: total,
      })
      clearCart()
      setBusy(false)
      navigate('/order-success', { state: { orderNumber } })
      return
    }

    const { data: inserted, error: insErr } = await supabase
      .from('orders')
      .insert(payload)
      .select('id')
      .single()

    if (insErr || !inserted?.id) {
      showToast(insErr?.message || 'Could not create order', 'error')
      setBusy(false)
      return
    }

    const orderIdRow = inserted.id

    if (!keyId) {
      showToast('Razorpay key missing in env', 'error')
      setBusy(false)
      return
    }

    try {
      const Razorpay = await loadRazorpayScript()
      const amountPaise = Math.round(total * 100)
      const orderData = await createRazorpayOrderServer({
        amountPaise,
        receipt: orderNumber,
      })

      openRazorpayCheckout({
        Razorpay,
        keyId,
        orderId: orderData.id,
        amountPaise,
        orderNumber,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        description: `Poster Galaxy #${orderNumber}`,
        onSuccess: async (response) => {
          const { error: upErr } = await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              razorpay_order_id: orderData.id,
              razorpay_payment_id: response.razorpay_payment_id,
            })
            .eq('id', orderIdRow)

          if (upErr) {
            showToast('Paid but update failed — contact support', 'error')
            setBusy(false)
            return
          }
          await upsertCustomerRecord({
            name: payload.customer_name,
            email: payload.customer_email,
            phone: payload.customer_phone,
            orderTotal: total,
          })
          clearCart()
          setBusy(false)
          navigate('/order-success', { state: { orderNumber } })
        },
        onDismiss: () => {
          showToast('Payment window closed — order is still pending.')
          setBusy(false)
        },
        onPaymentFailed: async () => {
          await supabase
            .from('orders')
            .update({ payment_status: 'failed' })
            .eq('id', orderIdRow)
          showToast('Payment failed', 'error')
          setBusy(false)
        },
      })
    } catch (e) {
      const msg =
        e?.message ||
        'Could not start payment. Deploy API route /api/create-razorpay-order on Vercel.'
      showToast(msg, 'error')
      setBusy(false)
    }
  }

  if (!items.length) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-20 text-center text-[#aaaaaa]">
          Nothing to checkout.{' '}
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="text-accent hover:underline"
          >
            Shop
          </button>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-bold text-white">Checkout</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold text-white">Delivery</h2>
            <input
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-white outline-none focus:border-accent"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-white outline-none focus:border-accent"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-white outline-none focus:border-accent"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-white outline-none focus:border-accent"
              placeholder="Address line"
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="rounded-xl border border-border bg-bg px-4 py-3 text-sm text-white outline-none focus:border-accent"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <input
                className="rounded-xl border border-border bg-bg px-4 py-3 text-sm text-white outline-none focus:border-accent"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <input
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-white outline-none focus:border-accent"
              placeholder="PIN code"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold text-white">Payment</h2>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-3">
              <input
                type="radio"
                name="pay"
                checked={payment === 'online'}
                onChange={() => setPayment('online')}
                className="text-accent"
              />
              <span className="text-sm text-white">Razorpay (cards, UPI, wallets)</span>
            </label>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-3">
              <input
                type="radio"
                name="pay"
                checked={payment === 'cod'}
                onChange={() => setPayment('cod')}
                className="text-accent"
              />
              <span className="text-sm text-white">Cash on delivery</span>
            </label>

            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium text-white">Coupon</p>
              <div className="mt-2 flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="min-h-[48px] flex-1 rounded-xl border border-border bg-bg px-4 text-sm text-white outline-none focus:border-accent"
                  placeholder="Code"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="rounded-xl border border-accent px-4 text-sm font-semibold text-accent hover:bg-accent/10"
                >
                  Apply
                </button>
              </div>
              {discount > 0 && (
                <p className="mt-2 text-sm text-green-400">
                  {discount}% off applied
                </p>
              )}
            </div>

            <dl className="space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between text-[#aaaaaa]">
                <dt>Subtotal</dt>
                <dd>{formatRupee(subtotal)}</dd>
              </div>
              {discounted > 0 && (
                <div className="flex justify-between text-green-400">
                  <dt>Discount</dt>
                  <dd>−{formatRupee(discounted)}</dd>
                </div>
              )}
              <div className="flex justify-between text-[#aaaaaa]">
                <dt>Shipping</dt>
                <dd>
                  {shipping === 0 ? 'FREE' : formatRupee(shipping)}
                </dd>
              </div>
              <div className="flex justify-between pt-2 text-lg font-semibold text-white">
                <dt>Total</dt>
                <dd className="text-accent">{formatRupee(total)}</dd>
              </div>
            </dl>

            <button
              type="button"
              disabled={busy}
              onClick={placeOrder}
              className="w-full min-h-[52px] rounded-xl bg-accent font-semibold text-black hover:bg-[#e6b800] disabled:opacity-50"
            >
              {busy ? 'Please wait…' : 'Place order'}
            </button>
            <p className="text-xs text-[#666]">
              Online payments require the Vercel API route{' '}
              <code className="text-[#aaaaaa]">/api/create-razorpay-order</code>{' '}
              with server keys. COD works without it.
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <ToastHost toast={toast} />
    </>
  )
}
