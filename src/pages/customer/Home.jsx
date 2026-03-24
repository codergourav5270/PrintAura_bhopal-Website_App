import { useEffect, useState } from 'react'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { Navbar } from '../../components/layout/Navbar.jsx'
import { CategoryGrid } from '../../components/sections/CategoryGrid.jsx'
import { CustomPosterCta } from '../../components/sections/CustomPosterCta.jsx'
import { Hero } from '../../components/sections/Hero.jsx'
import { HowItWorks } from '../../components/sections/HowItWorks.jsx'
import { InstagramStrip } from '../../components/sections/InstagramStrip.jsx'
import { ProductRowSection } from '../../components/sections/ProductRowSection.jsx'
import { Testimonials } from '../../components/sections/Testimonials.jsx'
import { TrustBadges } from '../../components/sections/TrustBadges.jsx'
import { BackToTop } from '../../components/ui/BackToTop.jsx'
import { ToastHost } from '../../components/ui/Toast.jsx'
import { useToast } from '../../hooks/useToast.js'
import { supabase } from '../../lib/supabase'

export default function Home() {
  const { toast, showToast } = useToast()
  const [newArrivals, setNewArrivals] = useState([])
  const [bestsellers, setBestsellers] = useState([])
  const [loadNew, setLoadNew] = useState(true)
  const [loadBest, setLoadBest] = useState(true)
  const [errNew, setErrNew] = useState('')
  const [errBest, setErrBest] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('badge', 'NEW')
        .limit(20)
      if (cancelled) return
      if (error) setErrNew(error.message || 'Could not load new arrivals')
      else setNewArrivals(data || [])
      setLoadNew(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('badge', 'BESTSELLER')
        .limit(20)
      if (cancelled) return
      if (error) setErrBest(error.message || 'Could not load bestsellers')
      else setBestsellers(data || [])
      setLoadBest(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <TrustBadges />
      <CategoryGrid />
      <ProductRowSection
        title="New arrivals"
        subtitle="Fresh drops with the NEW badge"
        products={newArrivals}
        loading={loadNew}
        error={errNew}
        showToast={showToast}
      />
      <CustomPosterCta />
      <ProductRowSection
        title="Bestsellers"
        subtitle="Community favourites"
        products={bestsellers}
        loading={loadBest}
        error={errBest}
        showToast={showToast}
      />
      <HowItWorks />
      <Testimonials />
      <InstagramStrip />
      <Footer />
      <BackToTop />
      <ToastHost toast={toast} />
    </>
  )
}
