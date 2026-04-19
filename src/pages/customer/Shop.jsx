import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { Navbar } from '../../components/layout/Navbar.jsx'
import { BackToTop } from '../../components/ui/BackToTop.jsx'
import { ProductCard } from '../../components/ui/ProductCard.jsx'
import { SkeletonCard } from '../../components/ui/Skeleton.jsx'
import { ToastHost } from '../../components/ui/Toast.jsx'
import { useToast } from '../../hooks/useToast.js'
import { CATEGORIES, supabase } from '../../lib/supabase'

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest' },
  { id: 'rated', label: 'Best rated' },
]

const SIZE_OPTS = ['A4', 'A3', 'A2', 'A1', '12x18', '18x24', '24x36']

function productHasSize(p, sizeLabel) {
  if (!sizeLabel) return true
  const sizes = p.sizes
  if (!Array.isArray(sizes)) return true
  return sizes.some((s) => s.label === sizeLabel)
}

export default function Shop() {
  const [searchParams] = useSearchParams()
  const initialQ = searchParams.get('q') || ''
  const { toast, showToast } = useToast()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchErr, setFetchErr] = useState('')
  const [category, setCategory] = useState('')
  const [sizeFilter, setSizeFilter] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState('featured')
  const [search, setSearch] = useState(initialQ)

  useEffect(() => {
    setSearch(initialQ)
  }, [initialQ])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase.from('products').select('*')
      if (cancelled) return
      if (error) {
        setFetchErr(error.message || 'Failed to load')
        setProducts([])
      } else {
        setFetchErr('')
        setProducts(data || [])
      }
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    let list = [...products]
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => String(t).toLowerCase().includes(q))
      )
    }
    if (category) list = list.filter((p) => p.category === category)
    if (inStockOnly) list = list.filter((p) => p.in_stock !== false)
    if (sizeFilter) list = list.filter((p) => productHasSize(p, sizeFilter))
    const minP = priceMin === '' ? null : Number(priceMin)
    const maxP = priceMax === '' ? null : Number(priceMax)
    if (minP != null && !Number.isNaN(minP))
      list = list.filter((p) => (p.price ?? 0) >= minP)
    if (maxP != null && !Number.isNaN(maxP))
      list = list.filter((p) => (p.price ?? 0) <= maxP)

    if (sort === 'price-asc')
      list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    else if (sort === 'price-desc')
      list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    else if (sort === 'newest')
      list.sort(
        (a, b) =>
          new Date(b.created_at || 0) - new Date(a.created_at || 0)
      )
    else if (sort === 'rated')
      list.sort((a, b) => String(b.id).localeCompare(String(a.id)))
    return list
  }, [
    products,
    search,
    category,
    inStockOnly,
    sizeFilter,
    priceMin,
    priceMax,
    sort,
  ])

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-bold text-white">Shop all posters</h1>
        <p className="mt-1 text-sm text-[#aaaaaa]">
          Filter and sort on your device — instant updates.
        </p>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          <aside className="w-full shrink-0 space-y-4 rounded-2xl border border-border bg-card p-4 lg:w-64">
            <label className="block text-xs font-medium text-[#666]">
              Search
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-accent"
            />
            <label className="block text-xs font-medium text-[#666]">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-accent"
            >
              <option value="">All</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <label className="block text-xs font-medium text-[#666]">
              Size
            </label>
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-accent"
            >
              <option value="">Any</option>
              {SIZE_OPTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-[#666]">Min ₹</label>
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-bg px-2 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#666]">Max ₹</label>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-bg px-2 py-2 text-sm text-white"
                />
              </div>
            </div>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm text-[#aaaaaa]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 rounded border-border text-accent"
              />
              In stock only
            </label>
          </aside>
          <div className="flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#aaaaaa]">
                {filtered.length} product{filtered.length === 1 ? '' : 's'}
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-white sm:w-56"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            {fetchErr && (
              <p className="mt-4 rounded-lg border border-red-500/40 bg-red-950/20 p-4 text-sm text-red-200">
                {fetchErr}
              </p>
            )}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                : filtered.length === 0
                  ? (
                      <div className="col-span-full rounded-2xl border border-border bg-card py-16 text-center text-[#aaaaaa]">
                        No products found. Try adjusting filters.
                      </div>
                    )
                  : filtered.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        showToast={showToast}
                      />
                    ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
      <ToastHost toast={toast} />
    </>
  )
}
