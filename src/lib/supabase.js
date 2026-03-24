import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.warn(
    'Supabase env missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  )
}

export const supabase = createClient(url || '', anonKey || '')

export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase()

export const CATEGORIES = [
  'Movies',
  'Anime',
  'Sports',
  'Motivational',
  'Aesthetic',
  'Nature',
  'Music',
  'Bollywood',
  'Abstract',
  'Minimal',
]

export function categoryToSlug(cat) {
  return String(cat || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
}

export function slugToCategory(slug) {
  const s = decodeURIComponent(slug || '').toLowerCase()
  return CATEGORIES.find((c) => categoryToSlug(c) === s) || null
}

export function formatRupee(n) {
  const v = Number(n) || 0
  return `₹${v.toLocaleString('en-IN')}`
}

export function generateOrderNumber() {
  const y = new Date().getFullYear()
  const seq = Math.floor(Math.random() * 9000) + 1000
  return `PZ-${y}-${seq}`
}
