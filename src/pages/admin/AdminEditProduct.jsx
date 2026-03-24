import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout.jsx'
import { PosterForm } from '../../components/admin/PosterForm.jsx'
import { supabase } from '../../lib/supabase'

export default function AdminEditProduct() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!id) return
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (cancelled) return
      if (error || !data) setErr(error?.message || 'Not found')
      else setProduct(data)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <AdminLayout title="Edit poster">
      {loading ? (
        <p className="text-[#aaaaaa]">Loading…</p>
      ) : err || !product ? (
        <div>
          <p className="text-red-300">{err}</p>
          <Link to="/admin/products" className="mt-4 inline-block text-accent">
            Back
          </Link>
        </div>
      ) : (
        <PosterForm mode="edit" initial={product} />
      )}
    </AdminLayout>
  )
}
