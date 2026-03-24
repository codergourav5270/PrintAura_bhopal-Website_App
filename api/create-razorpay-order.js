/**
 * Vercel Serverless Function — add to Vercel project env (not VITE_*):
 *   RAZORPAY_KEY_ID=...
 *   RAZORPAY_KEY_SECRET=...
 *
 * POST /api/create-razorpay-order
 * Body: { "amount": 49900, "currency": "INR", "receipt": "PZ-2025-1234" }
 * amount is in paise (₹499.00 = 49900)
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}')
    } catch {
      body = {}
    }
  }

  const amount = body.amount
  const currency = body.currency || 'INR'
  const receipt = body.receipt || `rcpt_${Date.now()}`

  if (amount == null || Number.isNaN(Number(amount))) {
    res.status(400).json({ error: 'amount required (integer paise)' })
    return
  }

  const key = process.env.RAZORPAY_KEY_ID
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!key || !secret) {
    res.status(500).json({
      error:
        'RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set on Vercel (server-side)',
    })
    return
  }

  const auth = Buffer.from(`${key}:${secret}`).toString('base64')
  const r = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: Number(amount),
      currency,
      receipt: String(receipt).slice(0, 40),
    }),
  })

  const data = await r.json()
  if (!r.ok) {
    res.status(400).json(data)
    return
  }

  res.status(200).json(data)
}
