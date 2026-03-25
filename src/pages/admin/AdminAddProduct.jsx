import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout.jsx'
import { ToastHost } from '../../components/ui/Toast.jsx'
import { useToast } from '../../hooks/useToast.js'
import { CATEGORIES, supabase } from '../../lib/supabase'

const DEFAULT_LABELS = ['A4', 'A3', 'A2', 'A1', '12x18', '18x24', '24x36']

function defaultSizes(basePrice) {
  return DEFAULT_LABELS.map((label, i) => ({
    label,
    price: Math.max(199, (Number(basePrice) || 299) + i * 40),
  }))
}

function makePreviewId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function AdminAddProduct() {
  const navigate = useNavigate()
  const { toast, showToast } = useToast()
  const [name, setName] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [tagsRaw, setTagsRaw] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('299')
  const [originalPrice, setOriginalPrice] = useState('399')
  const [badge, setBadge] = useState('')
  const [inStock, setInStock] = useState(true)
  const [sizes, setSizes] = useState(() => defaultSizes(299))
  /** @type {{ id: string, file: File, previewUrl: string }[]} */
  const [pendingImages, setPendingImages] = useState([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })

  const addSizeRow = () => {
    setSizes((s) => [...s, { label: 'Custom', price: Number(price) || 299 }])
  }

  const updateSize = (idx, field, val) => {
    setSizes((s) =>
      s.map((row, i) =>
        i === idx ? { ...row, [field]: field === 'price' ? Number(val) : val } : row
      )
    )
  }

  const removeSize = (idx) => {
    setSizes((s) => s.filter((_, i) => i !== idx))
  }

  const onFilesChosen = (e) => {
    const list = e.target.files
    if (!list?.length) return
    setErr('')
    const next = [...pendingImages]
    for (let i = 0; i < list.length; i++) {
      const file = list[i]
      const id = makePreviewId()
      const previewUrl = URL.createObjectURL(file)
      next.push({ id, file, previewUrl })
    }
    setPendingImages(next)
    e.target.value = ''
  }

  const removePreview = (id) => {
    setPendingImages((prev) => {
      const row = prev.find((p) => p.id === id)
      if (row?.previewUrl) URL.revokeObjectURL(row.previewUrl)
      return prev.filter((p) => p.id !== id)
    })
  }

  const buildRow = (imageUrl) => {
    const tags = tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    return {
      name: name.trim(),
      category,
      tags,
      description: description.trim() || null,
      price: Math.round(Number(price) || 0),
      original_price: Math.round(Number(originalPrice) || 0),
      image_url: imageUrl.trim(),
      sizes,
      badge: badge || null,
      in_stock: inStock,
    }
  }

  const save = async () => {
    setErr('')
    if (!name.trim()) {
      setErr('Name is required')
      return
    }
    if (!pendingImages.length) {
      setErr('Select at least one image')
      return
    }

    const total = pendingImages.length
    setBusy(true)
    setUploadProgress({ current: 0, total })

    try {
      for (let i = 0; i < total; i++) {
        setUploadProgress({ current: i + 1, total })
        const { file } = pendingImages[i]
        const ext = file.name.split('.').pop() || 'jpg'
        const path = `public/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: upErr } = await supabase.storage
          .from('poster-images')
          .upload(path, file, { cacheControl: '3600', upsert: true })
        if (upErr) {
          setErr(upErr.message)
          setBusy(false)
          setUploadProgress({ current: 0, total: 0 })
          return
        }
        const { data } = supabase.storage.from('poster-images').getPublicUrl(path)
        const publicUrl = data.publicUrl
        const row = buildRow(publicUrl)
        const { error: insErr } = await supabase.from('products').insert(row)
        if (insErr) {
          setErr(insErr.message)
          setBusy(false)
          setUploadProgress({ current: 0, total: 0 })
          return
        }
      }
      showToast(`✅ ${total} posters added successfully!`)
      setBusy(false)
      setUploadProgress({ current: 0, total: 0 })
      await new Promise((r) => setTimeout(r, 1500))
      navigate('/admin/products')
    } catch (e) {
      setErr(e?.message || 'Something went wrong')
      setBusy(false)
      setUploadProgress({ current: 0, total: 0 })
    }
  }

  const previewCount = pendingImages.length

  const progressPct = useMemo(() => {
    const { current, total } = uploadProgress
    if (!total) return 0
    return Math.round((current / total) * 100)
  }, [uploadProgress])

  return (
    <AdminLayout title="Add poster">
      <div className="max-w-3xl space-y-6">
        {err && (
          <p className="rounded-xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">
            {err}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs text-[#aaaaaa]">Poster name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs text-[#aaaaaa]">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#aaaaaa]">Tags (comma separated)</label>
            <input
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-[#aaaaaa]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs text-[#aaaaaa]">Price ₹</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs text-[#aaaaaa]">Original price ₹</label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs text-[#aaaaaa]">Badge</label>
            <select
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
            >
              <option value="">None</option>
              <option value="NEW">NEW</option>
              <option value="BESTSELLER">BESTSELLER</option>
              <option value="SALE">SALE</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex min-h-[48px] cursor-pointer items-center gap-3 text-sm text-[#aaaaaa]">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="h-4 w-4 rounded accent-accent"
              />
              In stock
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-white">Size pricing</h3>
            <button
              type="button"
              onClick={addSizeRow}
              className="rounded-lg border border-accent px-3 py-2 text-xs font-semibold text-accent hover:bg-accent/10"
            >
              + Add custom size
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {sizes.map((row, idx) => (
              <div key={`${row.label}-${idx}`} className="flex flex-wrap gap-2">
                <input
                  value={row.label}
                  onChange={(e) => updateSize(idx, 'label', e.target.value)}
                  className="min-w-[6rem] flex-1 rounded-xl border border-border bg-bg px-3 py-2 text-sm"
                  placeholder="Label"
                />
                <input
                  type="number"
                  value={row.price}
                  onChange={(e) => updateSize(idx, 'price', e.target.value)}
                  className="w-28 rounded-xl border border-border bg-bg px-3 py-2 text-sm"
                  placeholder="₹"
                />
                <button
                  type="button"
                  onClick={() => removeSize(idx)}
                  className="rounded-xl border border-red-500/40 px-3 py-2 text-xs text-red-400"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-white">Images</h3>
          <p className="mt-1 text-xs text-[#666]">
            Select one or many images; each becomes a product row with the same details
            above.
          </p>
          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-10 text-sm text-[#aaaaaa] hover:border-accent/40">
            <span>Click to select images (multiple) → Supabase bucket poster-images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onFilesChosen}
            />
          </label>

          {previewCount > 0 && (
            <p className="mt-4 text-sm font-medium text-white">
              {previewCount} image{previewCount === 1 ? '' : 's'} selected
            </p>
          )}

          {previewCount > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {pendingImages.map((p) => (
                <div
                  key={p.id}
                  className="relative aspect-square overflow-hidden rounded-lg border border-border bg-bg"
                >
                  <img
                    src={p.previewUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePreview(p.id)}
                    className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-sm text-white hover:bg-black/90"
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {uploadProgress.total > 0 && (
            <div className="mt-4">
              <p className="text-sm text-[#aaaaaa]">
                Uploading {uploadProgress.current} of {uploadProgress.total} images…
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={save}
            className="min-h-[48px] rounded-xl bg-accent px-8 py-3 font-semibold text-black disabled:opacity-50"
          >
            Save poster
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="min-h-[48px] rounded-xl border border-border px-8 py-3 font-medium text-white hover:bg-white/5"
          >
            Cancel
          </button>
        </div>
      </div>
      <ToastHost toast={toast} />
    </AdminLayout>
  )
}
