import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, supabase } from '../../lib/supabase'

const DEFAULT_LABELS = ['A4', 'A3', 'A2', 'A1', '12x18', '18x24', '24x36']

function defaultSizes(basePrice) {
  return DEFAULT_LABELS.map((label, i) => ({
    label,
    price: Math.max(199, (Number(basePrice) || 299) + i * 40),
  }))
}

export function PosterForm({
  mode = 'add',
  initial = null,
  onDeleted,
}) {
  const navigate = useNavigate()
  const [name, setName] = useState(initial?.name || '')
  const [category, setCategory] = useState(initial?.category || CATEGORIES[0])
  const [tagsRaw, setTagsRaw] = useState(
    Array.isArray(initial?.tags) ? initial.tags.join(', ') : ''
  )
  const [description, setDescription] = useState(initial?.description || '')
  const [price, setPrice] = useState(String(initial?.price ?? 299))
  const [originalPrice, setOriginalPrice] = useState(
    String(initial?.original_price ?? 399)
  )
  const [badge, setBadge] = useState(initial?.badge || '')
  const [inStock, setInStock] = useState(initial?.in_stock !== false)
  const [sizes, setSizes] = useState(() => {
    if (initial?.sizes && Array.isArray(initial.sizes) && initial.sizes.length)
      return initial.sizes
    return defaultSizes(initial?.price ?? 299)
  })
  const [imageUrl, setImageUrl] = useState(initial?.image_url || '')
  const [uploadPct, setUploadPct] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const canPreview = useMemo(() => !!imageUrl, [imageUrl])

  const onFile = async (file) => {
    if (!file) return
    setErr('')
    setUploading(true)
    setUploadPct(10)
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `public/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const timer = setInterval(() => {
      setUploadPct((p) => Math.min(90, p + 8))
    }, 120)
    const { error } = await supabase.storage.from('poster-images').upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })
    clearInterval(timer)
    if (error) {
      setUploading(false)
      setUploadPct(0)
      setErr(error.message)
      return
    }
    const { data } = supabase.storage.from('poster-images').getPublicUrl(path)
    setImageUrl(data.publicUrl)
    setUploadPct(100)
    setUploading(false)
    setTimeout(() => setUploadPct(0), 400)
  }

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

  const save = async () => {
    setErr('')
    if (!name.trim()) {
      setErr('Name is required')
      return
    }
    if (!imageUrl.trim()) {
      setErr('Image required')
      return
    }
    const tags = tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const row = {
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

    setBusy(true)
    if (mode === 'add') {
      const { error } = await supabase.from('products').insert(row)
      setBusy(false)
      if (error) {
        setErr(error.message)
        return
      }
    } else if (initial?.id) {
      const { error } = await supabase
        .from('products')
        .update(row)
        .eq('id', initial.id)
      setBusy(false)
      if (error) {
        setErr(error.message)
        return
      }
    }
    navigate('/admin/products')
  }

  const del = async () => {
    if (!initial?.id || !window.confirm('Delete this poster permanently?'))
      return
    setBusy(true)
    const { error } = await supabase.from('products').delete().eq('id', initial.id)
    setBusy(false)
    if (error) {
      setErr(error.message)
      return
    }
    onDeleted?.()
    navigate('/admin/products')
  }

  return (
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
        <h3 className="text-sm font-semibold text-white">Image</h3>
        {canPreview && (
          <img
            src={imageUrl}
            alt=""
            className="mt-3 max-h-64 rounded-xl border border-border object-contain"
          />
        )}
        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-10 text-sm text-[#aaaaaa] hover:border-accent/40">
          <span>Drag &amp; drop or click to upload → Supabase bucket poster-images</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
        {uploading && (
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${uploadPct}%` }}
            />
          </div>
        )}
        <p className="mt-2 text-xs text-[#666] break-all">{imageUrl}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={save}
          className="min-h-[48px] rounded-xl bg-accent px-8 py-3 font-semibold text-black disabled:opacity-50"
        >
          {mode === 'add' ? 'Save poster' : 'Update poster'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="min-h-[48px] rounded-xl border border-border px-8 py-3 font-medium text-white hover:bg-white/5"
        >
          Cancel
        </button>
        {mode === 'edit' && (
          <button
            type="button"
            disabled={busy}
            onClick={del}
            className="min-h-[48px] rounded-xl border border-red-500/50 px-8 py-3 font-semibold text-red-400 hover:bg-red-950/30"
          >
            Delete poster
          </button>
        )}
      </div>
    </div>
  )
}
