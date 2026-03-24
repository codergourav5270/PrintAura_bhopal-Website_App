import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { Navbar } from '../../components/layout/Navbar.jsx'
import { useCart } from '../../context/CartContext.jsx'
import {
  clearStoredCoupon,
  getStoredCoupon,
  setStoredCoupon,
} from '../../lib/couponStorage.js'
import { validateCouponCode } from '../../lib/ordersApi.js'
import { formatRupee } from '../../lib/supabase'

const FREE_SHIP_THRESHOLD = 499

export default function Cart() {
  const { items, updateQty, removeLine, subtotal } = useCart()
  const [couponInput, setCouponInput] = useState('')
  const [couponPct, setCouponPct] = useState(0)
  const [couponCode, setCouponCode] = useState('')
  const [couponErr, setCouponErr] = useState('')

  useEffect(() => {
    const s = getStoredCoupon()
    if (s) {
      setCouponPct(s.percent)
      setCouponCode(s.code)
    }
  }, [])

  const discounted = Math.round((subtotal * couponPct) / 100)
  const shipping =
    subtotal === 0 ? 0 : subtotal - discounted >= FREE_SHIP_THRESHOLD ? 0 : 79
  const total = Math.max(0, subtotal - discounted + shipping)

  const applyCoupon = async () => {
    setCouponErr('')
    const res = await validateCouponCode(couponInput)
    if (!res.ok) {
      setCouponErr(res.error)
      setCouponPct(0)
      setCouponCode('')
      clearStoredCoupon()
      return
    }
    setCouponPct(res.percent)
    setCouponCode(res.coupon.code)
    setStoredCoupon({ code: res.coupon.code, percent: res.percent })
  }

  const removeCoupon = () => {
    setCouponPct(0)
    setCouponCode('')
    setCouponInput('')
    clearStoredCoupon()
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-bold text-white">Cart</h1>
        {items.length === 0 ? (
          <p className="mt-8 text-[#aaaaaa]">
            Your cart is empty.{' '}
            <Link to="/shop" className="text-accent hover:underline">
              Browse posters
            </Link>
          </p>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {items.map((line) => (
                <div
                  key={line.id}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-4"
                >
                  <img
                    src={line.imageUrl}
                    alt=""
                    className="h-28 w-20 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{line.name}</p>
                    <p className="text-sm text-[#aaaaaa]">
                      Size {line.size}
                    </p>
                    <p className="mt-1 text-accent">{formatRupee(line.price)}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex items-center rounded-lg border border-border">
                        <button
                          type="button"
                          className="px-3 py-2 text-lg text-white"
                          onClick={() =>
                            updateQty(line.id, line.qty - 1)
                          }
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{line.qty}</span>
                        <button
                          type="button"
                          className="px-3 py-2 text-lg text-white"
                          onClick={() =>
                            updateQty(line.id, line.qty + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        className="text-sm text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-fit rounded-2xl border border-border bg-card p-6">
              <h2 className="font-semibold text-white">Summary</h2>
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-[#666]">Coupon</p>
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Code"
                    className="min-h-[44px] flex-1 rounded-xl border border-border bg-bg px-3 text-sm uppercase outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="rounded-xl border border-accent px-4 text-xs font-semibold text-accent hover:bg-accent/10"
                  >
                    Apply
                  </button>
                </div>
                {couponErr && (
                  <p className="text-xs text-red-400">{couponErr}</p>
                )}
                {couponCode && (
                  <p className="flex flex-wrap items-center justify-between gap-2 text-xs text-green-400">
                    <span>
                      {couponCode} (−{couponPct}%)
                    </span>
                    <button type="button" onClick={removeCoupon} className="underline">
                      Remove
                    </button>
                  </p>
                )}
              </div>
              <dl className="mt-4 space-y-2 text-sm">
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
                    {shipping === 0
                      ? subtotal === 0
                        ? formatRupee(0)
                        : 'FREE'
                      : formatRupee(shipping)}
                  </dd>
                </div>
                {subtotal > 0 &&
                  subtotal - discounted < FREE_SHIP_THRESHOLD &&
                  shipping > 0 && (
                  <p className="text-xs text-accent">
                    Add {formatRupee(
                      FREE_SHIP_THRESHOLD - (subtotal - discounted)
                    )}{' '}
                    more for free shipping
                  </p>
                )}
                <div className="flex justify-between border-t border-border pt-2 font-semibold text-white">
                  <dt>Total</dt>
                  <dd>{formatRupee(total)}</dd>
                </div>
              </dl>
              <Link
                to="/checkout"
                className="mt-6 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-accent font-semibold text-black hover:bg-[#e6b800]"
              >
                Proceed to checkout
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
