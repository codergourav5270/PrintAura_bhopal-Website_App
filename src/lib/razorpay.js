const SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'

export function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('No window'))
      return
    }
    if (window.Razorpay) {
      resolve(window.Razorpay)
      return
    }
    const existing = document.querySelector(`script[src="${SCRIPT}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Razorpay))
      existing.addEventListener('error', reject)
      return
    }
    const s = document.createElement('script')
    s.src = SCRIPT
    s.async = true
    s.onload = () => resolve(window.Razorpay)
    s.onerror = () => reject(new Error('Razorpay script failed'))
    document.body.appendChild(s)
  })
}

/**
 * Create Razorpay order via Vercel serverless: POST /api/create-razorpay-order
 * Body: { amount, currency, receipt }
 * amount in paise
 */
export async function createRazorpayOrderServer({ amountPaise, receipt }) {
  const res = await fetch('/api/create-razorpay-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: amountPaise,
      currency: 'INR',
      receipt,
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error || data?.description || 'Could not create payment order')
  }
  return data
}

export function openRazorpayCheckout({
  Razorpay,
  keyId,
  orderId,
  amountPaise,
  orderNumber,
  name,
  email,
  phone,
  description,
  onSuccess,
  onDismiss,
  onPaymentFailed,
}) {
  const options = {
    key: keyId,
    amount: amountPaise,
    currency: 'INR',
    name: 'Poster Galaxy',
    description: description || `Order ${orderNumber}`,
    order_id: orderId,
    handler(response) {
      onSuccess?.(response)
    },
    prefill: {
      name,
      email,
      contact: phone,
    },
    theme: { color: '#f5c518' },
    modal: {
      ondismiss() {
        onDismiss?.()
      },
    },
  }

  const rzp = new Razorpay(options)
  rzp.on('payment.failed', (res) => {
    onPaymentFailed?.(
      new Error(res?.error?.description || 'Payment failed')
    )
  })
  rzp.open()
}
