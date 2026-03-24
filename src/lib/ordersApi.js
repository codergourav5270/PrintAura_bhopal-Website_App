import { supabase } from './supabase'

export async function upsertCustomerRecord({
  name,
  email,
  phone,
  orderTotal,
}) {
  const em = (email || '').trim().toLowerCase()
  if (!em) return
  const { data: existing } = await supabase
    .from('customers')
    .select('*')
    .eq('email', em)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('customers')
      .update({
        name: name || existing.name,
        phone: phone || existing.phone,
        total_orders: (existing.total_orders || 0) + 1,
        total_spent: (existing.total_spent || 0) + orderTotal,
      })
      .eq('id', existing.id)
  } else {
    await supabase.from('customers').insert({
      name,
      email: em,
      phone,
      total_orders: 1,
      total_spent: orderTotal,
    })
  }
}

export async function validateCouponCode(code) {
  const c = (code || '').trim().toUpperCase()
  if (!c) return { ok: false, error: 'Enter a code' }
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', c)
    .eq('is_active', true)
    .maybeSingle()
  if (error || !data) return { ok: false, error: 'Invalid or inactive coupon' }
  return {
    ok: true,
    coupon: data,
    percent: Number(data.discount_percent) || 0,
  }
}
