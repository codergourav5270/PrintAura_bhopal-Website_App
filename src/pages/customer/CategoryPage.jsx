import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { Navbar } from '../../components/layout/Navbar.jsx'
import { BackToTop } from '../../components/ui/BackToTop.jsx'
import { ProductCard } from '../../components/ui/ProductCard.jsx'
import { SkeletonCard } from '../../components/ui/Skeleton.jsx'
import { ToastHost } from '../../components/ui/Toast.jsx'
import { useToast } from '../../hooks/useToast.js'
import { slugToCategory, supabase } from '../../lib/supabase'

export default function CategoryPage() {
  const { slug } = useParams()
  const category = slugToCategory(slug || '')
  const { toast, showToast } = useToast()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!category) {
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
      if (cancelled) return
      if (error) setErr(error.message)
      else setProducts(data || [])
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [category])

  const title = useMemo(() => category || 'Category', [category])

  if (!category) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-white">Category not found</h1>
          <Link to="/shop" className="mt-4 inline-block text-accent hover:underline">
            Back to shop
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
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="mt-1 text-sm text-[#aaaaaa]">
          Posters tagged under {title}.
        </p>
        {err && (
          <p className="mt-4 text-sm text-red-300">{err}</p>
        )}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p) => (
                <ProductCard key={p.id} product={p} showToast={showToast} />
              ))}
        </div>
        {!loading && products.length === 0 && (
          <p className="mt-8 text-center text-[#aaaaaa]">
            Nothing here yet — browse{' '}
            <Link to="/shop" className="text-accent hover:underline">
              all posters
            </Link>
            .
          </p>
        )}
      </main>
      <Footer />
      <BackToTop />
      <ToastHost toast={toast} />
    </>
  )
}
