import { createClient } from '@supabase/supabase-js'

// REPLACE WITH THIS
const url = String(import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

// Non-throwing defaults so a misconfigured env does not blank-screen the app on import.
// Requests still fail until real URL + anon key are set (e.g. in .env / .env.local).
const PLACEHOLDER_URL = 'https://placeholder.supabase.co'
const PLACEHOLDER_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.e30'

if (import.meta.env.DEV) {
  console.debug('[Vite env] Supabase', {
    mode: import.meta.env.MODE,
    VITE_SUPABASE_URL: url ? 'set (non-empty)' : 'missing or empty',
    VITE_SUPABASE_ANON_KEY: anonKey ? 'set (non-empty)' : 'missing or empty',
  })
}

if (!url || !anonKey) {
  console.warn(
    'Supabase env missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. ' +
      'If .env.local defines them with empty values, it overrides .env — remove the keys or fill them in. ' +
      'Using a placeholder client so the app can load; API calls will fail until configured.'
  )
}

export const supabase = createClient(
  url || PLACEHOLDER_URL,
  anonKey || PLACEHOLDER_ANON_KEY
)

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
