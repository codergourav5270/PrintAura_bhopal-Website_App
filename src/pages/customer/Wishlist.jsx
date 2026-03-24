import { useEffect, useState } from 'react'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { Navbar } from '../../components/layout/Navbar.jsx'
import { ProductCard } from '../../components/ui/ProductCard.jsx'
import { SkeletonCard } from '../../components/ui/Skeleton.jsx'
import { ToastHost } from '../../components/ui/Toast.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { useToast } from '../../hooks/useToast.js'
import { supabase } from '../../lib/supabase'

export default function Wishlist() {
  const { ids } = useWishlist()
  const { toast, showToast } = useToast()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!ids.length) {
        setProducts([])
        setLoading(false)
        return
      }
      setLoading(true)
      const { data } = await supabase.from('products').select('*').in('id', ids)
      if (!cancelled) setProducts(data || [])
      if (!cancelled) setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [ids.join(',')])

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-bold text-white">Wishlist</h1>
        <p className="mt-1 text-sm text-[#aaaaaa]">Saved on this device.</p>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : products.length === 0
              ? (
                  <p className="col-span-full text-center text-[#aaaaaa]">
                    No saved posters yet.
                  </p>
                )
              : products.map((p) => (
                  <ProductCard key={p.id} product={p} showToast={showToast} />
                ))}
        </div>
      </main>
      <Footer />
      <ToastHost toast={toast} />
    </>
  )
}
