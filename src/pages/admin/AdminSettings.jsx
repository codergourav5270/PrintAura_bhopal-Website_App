import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout.jsx'
import {
  fetchAdminSettingsRow,
  fetchCategorySettingByName,
  fetchHeroSettings,
  fetchSiteSettings,
  saveAdminSettingsRow,
  saveCategorySettingsRow,
  saveHeroSettings,
  saveSiteSettings,
  uploadToPublicBucket,
} from '../../lib/siteSettings.js'

const CATEGORY_OPTIONS = [
  'anime',
  'movies',
  'sports',
  'motivation',
  'nature',
  'music',
]

export default function AdminSettings() {
  const [storeName, setStoreName] = useState('')
  const [supportEmail, setSupportEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState('')

  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [heroVideoUrl, setHeroVideoUrl] = useState('')
  const [heroHeight, setHeroHeight] = useState('')
  const [heroText, setHeroText] = useState('')

  const [catName, setCatName] = useState('anime')
  const [catPosterUrl, setCatPosterUrl] = useState('')
  const [catVideoUrl, setCatVideoUrl] = useState('')

  const [upiId, setUpiId] = useState('')
  const [paymentScanner, setPaymentScanner] = useState('')
  const [adminEmailRow, setAdminEmailRow] = useState('')
  const [siteBannerUrl, setSiteBannerUrl] = useState('')
  const [sitePosterUrl, setSitePosterUrl] = useState('')
  const [adminJson, setAdminJson] = useState({})

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const s = await fetchSiteSettings()
      if (cancelled) return
      setStoreName(s.website_name || '')
      setSupportEmail(s.email || '')
      setPhone(s.phone || '')
      const h = await fetchHeroSettings()
      if (cancelled) return
      setHeroImageUrl(h.hero_background_image || '')
      setHeroVideoUrl(h.hero_background_video || '')
      setHeroHeight(h.hero_height || '')
      setHeroText(h.hero_text || '')
      const a = await fetchAdminSettingsRow()
      if (cancelled) return
      if (a) {
        setUpiId(a.upi_id || '')
        setPaymentScanner(a.payment_scanner || '')
        setAdminEmailRow(a.admin_email || '')
        const j =
          a.admin_settings && typeof a.admin_settings === 'object'
            ? a.admin_settings
            : {}
        setAdminJson(j)
        setSiteBannerUrl(j.site_banner_url || '')
        setSitePosterUrl(j.site_poster_url || '')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const row = await fetchCategorySettingByName(catName)
      if (cancelled) return
      if (row) {
        setCatPosterUrl(row.category_poster || '')
        setCatVideoUrl(row.category_video || '')
      } else {
        setCatPosterUrl('')
        setCatVideoUrl('')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [catName])

  const save = async () => {
    setErr('')
    const r1 = await saveSiteSettings({ storeName, supportEmail, phone })
    if (r1.error) {
      setErr(r1.error.message || 'Save failed')
      return
    }
    const r2 = await saveHeroSettings({
      hero_background_image: heroImageUrl,
      hero_background_video: heroVideoUrl,
      hero_height: heroHeight,
      hero_text: heroText,
    })
    if (r2.error) {
      setErr(r2.error.message || 'Hero save failed')
      return
    }
    const mergedJson = {
      ...adminJson,
      site_banner_url: siteBannerUrl,
      site_poster_url: sitePosterUrl,
    }
    const r3 = await saveAdminSettingsRow({
      upi_id: upiId,
      payment_scanner: paymentScanner,
      admin_email: adminEmailRow,
      admin_settings: mergedJson,
    })
    if (r3.error) {
      setErr(r3.error.message || 'Admin save failed')
      return
    }
    setAdminJson(mergedJson)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const saveCategory = async () => {
    setErr('')
    const r = await saveCategorySettingsRow({
      category_name: catName,
      category_poster: catPosterUrl,
      category_video: catVideoUrl,
    })
    if (r.error) {
      setErr(r.error.message || 'Category save failed')
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const onHeroImg = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setErr('')
    const { publicUrl, error } = await uploadToPublicBucket(
      'hero-media',
      'hero-image',
      f
    )
    if (error) {
      setErr(error.message || 'Upload failed')
      return
    }
    setHeroImageUrl(publicUrl || '')
  }

  const onHeroVid = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setErr('')
    const { publicUrl, error } = await uploadToPublicBucket(
      'hero-media',
      'hero-video',
      f
    )
    if (error) {
      setErr(error.message || 'Upload failed')
      return
    }
    setHeroVideoUrl(publicUrl || '')
  }

  const onCatPoster = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setErr('')
    const { publicUrl, error } = await uploadToPublicBucket(
      'category-media',
      catName,
      f
    )
    if (error) {
      setErr(error.message || 'Upload failed')
      return
    }
    setCatPosterUrl(publicUrl || '')
  }

  const onCatVid = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setErr('')
    const { publicUrl, error } = await uploadToPublicBucket(
      'category-media',
      catName,
      f
    )
    if (error) {
      setErr(error.message || 'Upload failed')
      return
    }
    setCatVideoUrl(publicUrl || '')
  }

  const onScanner = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setErr('')
    const { publicUrl, error } = await uploadToPublicBucket(
      'admin-media',
      'scanner',
      f
    )
    if (error) {
      setErr(error.message || 'Upload failed')
      return
    }
    setPaymentScanner(publicUrl || '')
  }

  const onBanner = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setErr('')
    const { publicUrl, error } = await uploadToPublicBucket(
      'site-media',
      'banners',
      f
    )
    if (error) {
      setErr(error.message || 'Upload failed')
      return
    }
    setSiteBannerUrl(publicUrl || '')
  }

  const onSitePoster = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setErr('')
    const { publicUrl, error } = await uploadToPublicBucket(
      'site-media',
      'posters',
      f
    )
    if (error) {
      setErr(error.message || 'Upload failed')
      return
    }
    setSitePosterUrl(publicUrl || '')
  }

  return (
    <AdminLayout title="Settings">
      <div className="max-w-lg space-y-4 rounded-2xl border border-border bg-card p-6">
        <p className="text-sm text-[#aaaaaa]">
          Store settings are saved in Supabase (settings table). Use for display
          copy or internal notes — Supabase project URLs stay in env vars.
        </p>
        {err && (
          <p className="text-sm text-red-400">{err}</p>
        )}
        <div>
          <label className="text-xs text-[#aaaaaa]">Store name</label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-[#aaaaaa]">Support email (display)</label>
          <input
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-[#aaaaaa]">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-[#aaaaaa]">Hero image upload</label>
          <input
            type="file"
            accept="image/*"
            onChange={onHeroImg}
            className="mt-1 w-full text-xs text-[#aaaaaa]"
          />
          <p className="mt-1 break-all text-xs text-[#666]">{heroImageUrl}</p>
        </div>
        <div>
          <label className="text-xs text-[#aaaaaa]">Hero video upload</label>
          <input
            type="file"
            accept="video/*"
            onChange={onHeroVid}
            className="mt-1 w-full text-xs text-[#aaaaaa]"
          />
          <p className="mt-1 break-all text-xs text-[#666]">{heroVideoUrl}</p>
        </div>
        <div>
          <label className="text-xs text-[#aaaaaa]">Hero height</label>
          <input
            value={heroHeight}
            onChange={(e) => setHeroHeight(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-[#aaaaaa]">Hero text</label>
          <input
            value={heroText}
            onChange={(e) => setHeroText(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-[#aaaaaa]">Category</label>
          <select
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-[#aaaaaa]">Category poster upload</label>
          <input
            type="file"
            accept="image/*"
            onChange={onCatPoster}
            className="mt-1 w-full text-xs text-[#aaaaaa]"
          />
          <p className="mt-1 break-all text-xs text-[#666]">{catPosterUrl}</p>
        </div>
        <div>
          <label className="text-xs text-[#aaaaaa]">Category video upload</label>
          <input
            type="file"
            accept="video/*"
            onChange={onCatVid}
            className="mt-1 w-full text-xs text-[#aaaaaa]"
          />
          <p className="mt-1 break-all text-xs text-[#666]">{catVideoUrl}</p>
        </div>
        <button
          type="button"
          onClick={saveCategory}
          className="min-h-[48px] w-full rounded-xl border border-border px-6 font-semibold text-white"
        >
          Save category media
        </button>
        <div>
          <label className="text-xs text-[#aaaaaa]">Site banner upload</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={onBanner}
            className="mt-1 w-full text-xs text-[#aaaaaa]"
          />
          <p className="mt-1 break-all text-xs text-[#666]">{siteBannerUrl}</p>
        </div>
        <div>
          <label className="text-xs text-[#aaaaaa]">Site poster upload</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={onSitePoster}
            className="mt-1 w-full text-xs text-[#aaaaaa]"
          />
          <p className="mt-1 break-all text-xs text-[#666]">{sitePosterUrl}</p>
        </div>
        <div>
          <label className="text-xs text-[#aaaaaa]">UPI ID</label>
          <input
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-[#aaaaaa]">Payment scanner upload</label>
          <input
            type="file"
            accept="image/*"
            onChange={onScanner}
            className="mt-1 w-full text-xs text-[#aaaaaa]"
          />
          <p className="mt-1 break-all text-xs text-[#666]">{paymentScanner}</p>
        </div>
        <div>
          <label className="text-xs text-[#aaaaaa]">Admin email</label>
          <input
            value={adminEmailRow}
            onChange={(e) => setAdminEmailRow(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={save}
          className="min-h-[48px] rounded-xl bg-accent px-6 font-semibold text-black"
        >
          Save settings
        </button>
        {saved && (
          <p className="text-sm text-emerald-400">Saved locally.</p>
        )}
      </div>
    </AdminLayout>
  )
}
