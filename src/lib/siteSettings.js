import { supabase } from './supabase'

let siteConfigCache = null
let siteConfigLoadPromise = null

function emptySiteConfig() {
  return {
    settingsRow: null,
    heroRow: null,
    categoryRows: [],
    adminRow: null,
  }
}

async function loadAllSiteConfigFromDb() {
  try {
    const [settingsRes, heroRes, catRes, adminRes] = await Promise.all([
      supabase.from('settings').select('*').limit(1).maybeSingle(),
      supabase.from('hero_settings').select('*').limit(1).maybeSingle(),
      supabase.from('category_settings').select('*'),
      supabase.from('admin_settings').select('*').limit(1).maybeSingle(),
    ])
    return {
      settingsRow: settingsRes.error ? null : settingsRes.data,
      heroRow: heroRes.error ? null : heroRes.data,
      categoryRows: catRes.error ? [] : catRes.data || [],
      adminRow: adminRes.error ? null : adminRes.data,
    }
  } catch {
    return emptySiteConfig()
  }
}

export function prefetchSiteConfig() {
  if (!siteConfigLoadPromise) {
    siteConfigLoadPromise = loadAllSiteConfigFromDb()
      .then((data) => {
        siteConfigCache = data
        return data
      })
      .catch(() => {
        siteConfigCache = emptySiteConfig()
        return siteConfigCache
      })
  }
  return siteConfigLoadPromise
}

export async function ensureSiteConfigLoaded() {
  await prefetchSiteConfig()
}

export const DEFAULT_SITE_SETTINGS = {
  website_name: 'PrintAura_bhopal',
  email: 'printaurabhopal@gmail.com',
  phone: '7869014601,7999830083',
  hero_background: {},
  category_data: {
    previews: [
      'https://placehold.co/400x533/1a1a1a/f5c518?text=Movies',
      'https://placehold.co/400x533/1a1a1a/ffffff?text=Anime',
      'https://placehold.co/400x533/1a1a1a/f5c518?text=Sports',
      'https://placehold.co/400x533/1a1a1a/ffffff?text=Motivation',
      'https://placehold.co/400x533/1a1a1a/f5c518?text=Aesthetic',
      'https://placehold.co/400x533/1a1a1a/ffffff?text=Nature',
      'https://placehold.co/400x533/1a1a1a/f5c518?text=Music',
      'https://placehold.co/400x533/1a1a1a/ffffff?text=Bollywood',
    ],
  },
  admin_settings: {
    enquiriesEmail: 'query999@gmail.com',
    helpEmail: 'support999@gmail.com',
    directPhones: ['7869014601', '7999830083'],
  },
}

function mergeAdminSettings(raw) {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_SITE_SETTINGS.admin_settings }
  }
  return { ...DEFAULT_SITE_SETTINGS.admin_settings, ...raw }
}

export function mergeSiteSettingsRow(row) {
  try {
    if (!row) {
      return {
        ...DEFAULT_SITE_SETTINGS,
        admin_settings: mergeAdminSettings(null),
      }
    }
    return {
      ...DEFAULT_SITE_SETTINGS,
      ...row,
      website_name: row.website_name || DEFAULT_SITE_SETTINGS.website_name,
      email: row.email || DEFAULT_SITE_SETTINGS.email,
      phone: row.phone || DEFAULT_SITE_SETTINGS.phone,
      hero_background:
        row.hero_background && typeof row.hero_background === 'object'
          ? row.hero_background
          : {},
      category_data:
        row.category_data && typeof row.category_data === 'object'
          ? {
              ...DEFAULT_SITE_SETTINGS.category_data,
              ...row.category_data,
              previews:
                Array.isArray(row.category_data.previews) &&
                row.category_data.previews.length >= 8
                  ? row.category_data.previews
                  : DEFAULT_SITE_SETTINGS.category_data.previews,
            }
          : { ...DEFAULT_SITE_SETTINGS.category_data },
      admin_settings: mergeAdminSettings(row.admin_settings),
    }
  } catch {
    return mergeSiteSettingsRow(null)
  }
}

export async function fetchSiteSettings() {
  await ensureSiteConfigLoaded()
  return mergeSiteSettingsRow(siteConfigCache?.settingsRow ?? null)
}

export async function saveSiteSettings({ storeName, supportEmail, phone }) {
  const payload = {
    website_name: storeName,
    email: supportEmail,
  }
  if (phone !== undefined && phone !== null) {
    payload.phone = phone
  }
  const { data: existing, error: readErr } = await supabase
    .from('settings')
    .select('id')
    .limit(1)
    .maybeSingle()
  if (readErr) return { error: readErr }
  if (existing?.id) {
    return supabase.from('settings').update(payload).eq('id', existing.id)
  }
  return supabase.from('settings').insert({
    website_name: storeName,
    email: supportEmail,
    phone:
      phone !== undefined && phone !== null
        ? phone
        : DEFAULT_SITE_SETTINGS.phone,
    hero_background: {},
    category_data: DEFAULT_SITE_SETTINGS.category_data,
    admin_settings: DEFAULT_SITE_SETTINGS.admin_settings,
  })
}

export async function uploadToPublicBucket(bucket, folderPath, file) {
  if (!file) return { publicUrl: null, error: new Error('No file') }
  const safe = String(file.name || 'file').replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${folderPath}/${Date.now()}-${safe}`
  const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  })
  if (upErr) return { publicUrl: null, error: upErr }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { publicUrl: data.publicUrl, error: null }
}

const EMPTY_HERO = {
  hero_background_image: '',
  hero_background_video: '',
  hero_height: '',
  hero_text: '',
}

export async function fetchHeroSettings() {
  await ensureSiteConfigLoaded()
  if (siteConfigCache?.heroRow) {
    return { ...EMPTY_HERO, ...siteConfigCache.heroRow }
  }
  return { ...EMPTY_HERO }
}

export async function saveHeroSettings(fields) {
  const payload = {
    hero_background_image: fields.hero_background_image,
    hero_background_video: fields.hero_background_video,
    hero_height: fields.hero_height,
    hero_text: fields.hero_text,
  }
  const { data: existing, error: readErr } = await supabase
    .from('hero_settings')
    .select('id')
    .limit(1)
    .maybeSingle()
  if (readErr) return { error: readErr }
  if (existing?.id) {
    return supabase.from('hero_settings').update(payload).eq('id', existing.id)
  }
  return supabase.from('hero_settings').insert(payload)
}

export async function fetchCategorySettingByName(category_name) {
  await ensureSiteConfigLoaded()
  const rows = siteConfigCache?.categoryRows
  if (!Array.isArray(rows)) return null
  return rows.find((r) => r.category_name === category_name) || null
}

export async function saveCategorySettingsRow({
  category_name,
  category_poster,
  category_video,
}) {
  const { data: row, error: readErr } = await supabase
    .from('category_settings')
    .select('id')
    .eq('category_name', category_name)
    .maybeSingle()
  if (readErr) return { error: readErr }
  const payload = { category_name, category_poster, category_video }
  if (row?.id) {
    return supabase.from('category_settings').update(payload).eq('id', row.id)
  }
  return supabase.from('category_settings').insert(payload)
}

export async function fetchAdminSettingsRow() {
  await ensureSiteConfigLoaded()
  return siteConfigCache?.adminRow || null
}

export async function saveAdminSettingsRow(payload) {
  const { data: existing, error: readErr } = await supabase
    .from('admin_settings')
    .select('*')
    .limit(1)
    .maybeSingle()
  if (readErr) return { error: readErr }
  if (existing?.id) {
    const next = {
      upi_id:
        payload.upi_id !== undefined ? payload.upi_id : existing.upi_id,
      payment_scanner:
        payload.payment_scanner !== undefined
          ? payload.payment_scanner
          : existing.payment_scanner,
      admin_email:
        payload.admin_email !== undefined
          ? payload.admin_email
          : existing.admin_email,
      admin_settings:
        payload.admin_settings !== undefined
          ? payload.admin_settings
          : existing.admin_settings,
    }
    return supabase.from('admin_settings').update(next).eq('id', existing.id)
  }
  return supabase.from('admin_settings').insert({
    upi_id: payload.upi_id ?? null,
    payment_scanner: payload.payment_scanner ?? null,
    admin_email: payload.admin_email ?? null,
    admin_settings: payload.admin_settings ?? {},
  })
}
