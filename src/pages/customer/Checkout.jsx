import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { Navbar } from '../../components/layout/Navbar.jsx'
import { ToastHost } from '../../components/ui/Toast.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useToast } from '../../hooks/useToast.js'
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

const UPI_ID = 'ramandeepnathawat2553-2@okaxis'

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
  const [qrModal, setQrModal] = useState(null)
  const [copied, setCopied] = useState(false)
  const [qrVerifyStep, setQrVerifyStep] = useState('qr')
  const [utrInput, setUtrInput] = useState('')
  const [screenshotFile, setScreenshotFile] = useState(null)

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

  const qrImageSrc = useMemo(() => {
    if (!qrModal) return ''
    const am = Number(qrModal.total).toFixed(2)
    const upiData = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent('PrintAura_bhopal')}&am=${am}&cu=INR&tn=${encodeURIComponent(`Order${qrModal.orderNumber}`)}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiData)}`
  }, [qrModal])

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Could not copy', 'error')
    }
  }

  const onPaidConfirm = () => {
    if (!qrModal) return
    setQrVerifyStep('verify')
  }

  const handlePaymentPending = async () => {
    if (!qrModal) return
    const utr = utrInput.trim()
    if (!utr) {
      showToast('Enter transaction ID (UTR)', 'error')
      return
    }
    setBusy(true)
    let screenshotUrl = null
    if (screenshotFile) {
      const ext = screenshotFile.name.split('.').pop() || 'jpg'
      const path = `payment-proofs/${qrModal.orderId}-${Date.now()}.${ext}`
      const { error: stErr } = await supabase.storage
        .from('poster-images')
        .upload(path, screenshotFile, { cacheControl: '3600', upsert: true })
      if (stErr) {
        showToast(stErr.message || 'Screenshot upload failed', 'error')
        setBusy(false)
        return
      }
      const { data: pub } = supabase.storage.from('poster-images').getPublicUrl(path)
      screenshotUrl = pub.publicUrl
    }
    const { error: upErr } = await supabase
      .from('orders')
      .update({
        payment_method: 'QR',
        payment_status: 'pending',
        order_status: 'pending_payment',
        razorpay_payment_id: utr,
        razorpay_order_id: screenshotUrl,
      })
      .eq('id', qrModal.orderId)

    if (upErr) {
      showToast(upErr.message || 'Update failed', 'error')
      setBusy(false)
      return
    }
    showToast(
      'Payment submitted. We will verify and confirm your order.'
    )
    clearCart()
    setQrModal(null)
    setQrVerifyStep('qr')
    setUtrInput('')
    setScreenshotFile(null)
    setBusy(false)
  }

  const onCancelQr = async () => {
    if (!qrModal) return
    setBusy(true)
    await supabase
      .from('orders')
      .update({ payment_status: 'failed' })
      .eq('id', qrModal.orderId)
    setQrModal(null)
    setQrVerifyStep('qr')
    setUtrInput('')
    setScreenshotFile(null)
    setBusy(false)
    showToast('Payment cancelled. Try again.', 'error')
  }

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
      const { error } = await supabase.from('orders').insert(payload).select('id').single()
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

    setQrModal({
      orderId: inserted.id,
      orderNumber,
      total,
    })
    setQrVerifyStep('qr')
    setUtrInput('')
    setScreenshotFile(null)
    setBusy(false)
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
              <span className="text-sm text-white">Pay Online</span>
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
          </div>
        </div>
      </main>
      <Footer />
      <ToastHost toast={toast} />

      {qrModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 p-4">
          <div
            className="absolute inset-0"
            role="presentation"
            aria-hidden
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-[#1a1a1a] p-6 shadow-2xl">
            <h2 className="text-center text-xl font-bold text-white">
              Complete Your Payment
            </h2>
            <p className="mt-4 text-center text-3xl font-bold text-white">
              Pay{' '}
              <span className="text-[#f5c518]">{formatRupee(qrModal.total)}</span>
            </p>

            <div className="mt-6 flex justify-center">
            <img
            src="/QR_Raman.jpeg"
            alt="Payment QR code" 
                width={250}
                height={250}
                className="h-[250px] w-[250px] rounded-lg border border-border bg-white object-contain"
              />
            </div>

            <p className="mt-4 text-center text-sm text-[#aaaaaa]">
              Scan with any UPI app to pay
            </p>
            <p className="mt-1 text-center text-xs text-[#666]">
              GPay • PhonePe • Paytm • BHIM • Any UPI App
            </p>

            <div className="mt-6 rounded-xl border border-border bg-bg px-4 py-3">
              <p className="text-xs text-[#aaaaaa]">Or pay directly to UPI ID:</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm text-white">{UPI_ID}</span>
                <button
                  type="button"
                  onClick={copyUpi}
                  className="rounded-lg border border-accent px-3 py-1 text-xs font-semibold text-[#f5c518] hover:bg-accent/10"
                >
                  Copy
                </button>
                {copied && (
                  <span className="text-xs text-green-400">Copied!</span>
                )}
              </div>
            </div>

            {qrVerifyStep === 'qr' && (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={onPaidConfirm}
                  className="mt-6 w-full min-h-[52px] rounded-xl bg-[#f5c518] font-semibold text-black hover:bg-[#e6b800] disabled:opacity-50"
                >
                  I Have Paid ✅
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={onCancelQr}
                  className="mt-3 w-full text-center text-sm text-red-400 hover:underline disabled:opacity-50"
                >
                  Cancel Payment
                </button>
              </>
            )}

            {qrVerifyStep === 'verify' && (
              <div className="mt-6 space-y-4 border-t border-border pt-6">
                <p className="text-center text-sm font-medium text-white">
                  Enter Transaction ID (UTR)
                </p>
                <input
                  type="text"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  placeholder="12-digit UTR / reference"
                  className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-white outline-none focus:border-accent"
                />
                <div>
                  <p className="mb-2 text-xs text-[#aaaaaa]">
                    Upload Payment Screenshot (optional)
                  </p>
                  <label className="flex cursor-pointer flex-col rounded-xl border border-dashed border-border bg-bg px-4 py-3 text-center text-xs text-[#aaaaaa] hover:border-accent/40">
                    <span>
                      {screenshotFile ? screenshotFile.name : 'Choose file'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setScreenshotFile(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={handlePaymentPending}
                  className="w-full min-h-[52px] rounded-xl bg-[#f5c518] font-semibold text-black hover:bg-[#e6b800] disabled:opacity-50"
                >
                  {busy ? 'Submitting…' : 'Submit payment details'}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setQrVerifyStep('qr')}
                  className="w-full text-center text-sm text-[#aaaaaa] hover:text-white"
                >
                  ← Back
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
