import { Heart, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { Navbar } from '../../components/layout/Navbar.jsx'
import { ProductCard } from '../../components/ui/ProductCard.jsx'
import { SkeletonCard } from '../../components/ui/Skeleton.jsx'
import { ToastHost } from '../../components/ui/Toast.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { useToast } from '../../hooks/useToast.js'
import { formatRupee, supabase } from '../../lib/supabase'

function parseSizes(sizes, fallbackPrice) {
  const d = [
    { label: 'A4', price: fallbackPrice },
    { label: 'A3', price: fallbackPrice + 100 },
  ]
  if (!sizes) return d
  if (Array.isArray(sizes)) return sizes.length ? sizes : d
  try {
    const p = typeof sizes === 'string' ? JSON.parse(sizes) : sizes
    return Array.isArray(p) && p.length ? p : d
  } catch {
    return d
  }
}

export default function Product() {
  const { id } = useParams()
  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const { toast, showToast } = useToast()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [activeImg, setActiveImg] = useState(0)
  const [sizeIdx, setSizeIdx] = useState(0)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!id) return
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (cancelled) return
      if (error || !data) {
        setErr(error?.message || 'Product not found')
        setProduct(null)
      } else {
        setErr('')
        setProduct(data)
        const { data: rel } = await supabase
          .from('products')
          .select('*')
          .eq('category', data.category)
          .neq('id', id)
          .limit(8)
        if (!cancelled) setRelated(rel || [])
      }
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const sizes = useMemo(
    () => parseSizes(product?.sizes, product?.price ?? 0),
    [product]
  )
  const selected = sizes[sizeIdx] || sizes[0]
  const unitPrice = Number(selected?.price ?? product?.price ?? 0)
  const thumbs = useMemo(() => {
    if (!product?.image_url) return []
    return [product.image_url]
  }, [product])

  const inStock = product?.in_stock !== false

  const onAdd = () => {
    if (!product || !inStock) {
      showToast('Unavailable', 'error')
      return
    }
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        imageUrl: product.image_url,
        size: selected.label,
        price: unitPrice,
        category: product.category,
        qty: 1,
      })
    }
    showToast(`Added ${qty}× to cart`)
  }

  if (loading) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <SkeletonCard />
            <div className="space-y-4">
              <div className="h-8 w-2/3 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="text-[#aaaaaa]">{err || 'Not found'}</p>
          <Link to="/shop" className="mt-4 inline-block text-accent">
            Shop
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-black/30">
              <img
                src={thumbs[activeImg] || product.image_url}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            {thumbs.length > 1 && (
              <div className="mt-3 flex gap-2">
                {thumbs.map((t, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    className={`h-16 w-14 overflow-hidden rounded-lg border ${
                      activeImg === i ? 'border-accent' : 'border-border'
                    }`}
                  >
                    <img src={t} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            {product.badge && (
              <span className="inline-block rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-black">
                {product.badge}
              </span>
            )}
            <h1 className="mt-2 text-3xl font-bold text-white">{product.name}</h1>
            <p className="mt-2 text-sm text-[#aaaaaa]">{product.category}</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-accent">
                {formatRupee(unitPrice)}
              </span>
              {product.original_price > unitPrice && (
                <span className="text-[#666] line-through">
                  {formatRupee(product.original_price)}
                </span>
              )}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-[#cccccc]">
              {product.description || 'Premium matte poster — shipped in protective packaging.'}
            </p>

            <div className="mt-8">
              <p className="text-sm font-medium text-white">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {sizes.map((s, i) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setSizeIdx(i)}
                    className={`min-h-[44px] rounded-xl border px-4 py-2 text-sm ${
                      sizeIdx === i
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border text-[#aaaaaa] hover:border-white/20'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm text-[#aaaaaa]">Qty</span>
              <div className="flex items-center rounded-xl border border-border">
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center text-white"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center text-white"
                  onClick={() => setQty((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!inStock}
                onClick={onAdd}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-black disabled:opacity-40"
              >
                <ShoppingBag className="h-5 w-5" />
                Add to cart
              </button>
              <button
                type="button"
                onClick={() => {
                  toggle(product.id)
                  showToast(
                    has(product.id) ? 'Removed from wishlist' : 'Saved to wishlist'
                  )
                }}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 font-medium text-white hover:border-accent/40"
              >
                <Heart
                  className={`h-5 w-5 ${has(product.id) ? 'fill-accent text-accent' : ''}`}
                />
                Wishlist
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-xl font-bold text-white">You may also like</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} showToast={showToast} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <ToastHost toast={toast} />
    </>
  )
}
