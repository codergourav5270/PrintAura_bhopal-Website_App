import { Heart, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { formatRupee } from '../../lib/supabase'
import { Modal } from './Modal.jsx'

const DEFAULT_SIZES = [
  { label: 'A4', price: 249 },
  { label: 'A3', price: 349 },
]

function parseSizes(sizes) {
  if (!sizes) return DEFAULT_SIZES
  if (Array.isArray(sizes)) return sizes.length ? sizes : DEFAULT_SIZES
  try {
    const p = typeof sizes === 'string' ? JSON.parse(sizes) : sizes
    return Array.isArray(p) && p.length ? p : DEFAULT_SIZES
  } catch {
    return DEFAULT_SIZES
  }
}

function pseudoRating(id) {
  const n = id ? String(id).length : 5
  return (4 + (n % 10) / 10).toFixed(1)
}

export function ProductCard({ product, showToast }) {
  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)

  const sizes = parseSizes(product.sizes)
  const id = product.id
  const wishlisted = has(id)
  const badge = product.badge
  const inStock = product.in_stock !== false
  const orig = product.original_price
  const price = product.price
  const addWithSize = (sizeRow) => {
    const p = Number(sizeRow.price ?? price)
    addItem({
      productId: id,
      name: product.name,
      imageUrl: product.image_url,
      size: sizeRow.label,
      price: p,
      category: product.category,
    })
    showToast?.(`Added ${product.name} (${sizeRow.label})`)
    setModalOpen(false)
  }

  const onAddClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!inStock) {
      showToast?.('Currently out of stock', 'error')
      return
    }
    if (sizes.length > 1) {
      setSelectedSize(sizes[0])
      setModalOpen(true)
    } else {
      addWithSize(sizes[0])
    }
  }

  const onWish = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(id)
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition hover:border-accent/30">
        <Link to={`/product/${id}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden bg-black/40">
            <img
              src={
                product.image_url ||
                'https://placehold.co/400x533/1a1a1a/ffffff?text=Poster'
              }
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            {badge && (
              <span className="absolute left-2 top-2 rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-black">
                {badge}
              </span>
            )}
            <button
              type="button"
              onClick={onWish}
              className="absolute right-2 top-2 flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border bg-black/50 text-white backdrop-blur hover:bg-black/70"
              aria-label="Wishlist"
            >
              <Heart
                className={`h-5 w-5 ${wishlisted ? 'fill-accent text-accent' : ''}`}
              />
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={onAddClick}
                className="pointer-events-auto flex w-full min-h-[44px] items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-black"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </div>
          <div className="space-y-1 p-3">
            <p className="line-clamp-1 text-sm font-medium text-white">
              {product.name}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-border bg-bg px-2 py-0.5 text-[11px] text-[#aaaaaa]">
                {product.category}
              </span>
              <span className="text-[11px] text-[#aaaaaa]">
                ★ {pseudoRating(id)}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-accent">{formatRupee(price)}</span>
              {orig && orig > price && (
                <span className="text-sm text-[#666] line-through">
                  {formatRupee(orig)}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Choose size"
        wide
      >
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s.label}
                type="button"
                className={`min-h-[44px] rounded-lg border px-3 py-2 text-sm ${
                  selectedSize?.label === s.label
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border text-[#aaaaaa] hover:border-white/20'
                }`}
                onClick={() => setSelectedSize(s)}
              >
                {s.label} — {formatRupee(s.price ?? price)}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!selectedSize}
            onClick={() => selectedSize && addWithSize(selectedSize)}
            className="w-full min-h-[48px] rounded-xl bg-accent py-3 font-semibold text-black disabled:opacity-40"
          >
            Add to cart
          </button>
        </div>
      </Modal>
    </>
  )
}
