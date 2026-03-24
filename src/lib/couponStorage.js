const KEY = 'poster_galaxy_session_coupon_v1'

export function getStoredCoupon() {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const p = JSON.parse(raw)
    if (p && p.code && typeof p.percent === 'number') return p
    return null
  } catch {
    return null
  }
}

export function setStoredCoupon({ code, percent }) {
  sessionStorage.setItem(KEY, JSON.stringify({ code, percent }))
}

export function clearStoredCoupon() {
  sessionStorage.removeItem(KEY)
}
