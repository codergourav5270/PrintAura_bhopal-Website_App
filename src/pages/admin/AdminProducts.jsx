import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { formatRupee, supabase } from '../../lib/supabase'

const PAGE_SIZE = 10

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)
  const [deleteId, setDeleteId] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return products
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(s) ||
        p.category?.toLowerCase().includes(s)
    )
  }, [products, q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(page, totalPages - 1)
  const slice = filtered.slice(
    pageSafe * PAGE_SIZE,
    pageSafe * PAGE_SIZE + PAGE_SIZE
  )

  useEffect(() => {
    setPage(0)
  }, [q])

  const confirmDelete = async () => {
    if (!deleteId) return
    setBusy(true)
    await supabase.from('products').delete().eq('id', deleteId)
    setBusy(false)
    setDeleteId(null)
    await load()
  }

  return (
    <AdminLayout title="Products">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or category"
            className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm outline-none focus:border-accent"
          />
        </div>
        <Link
          to="/admin/products/add"
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-accent px-5 font-semibold text-black hover:bg-[#e6b800]"
        >
          <Plus className="h-5 w-5" />
          Add new poster
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-border bg-bg/80 text-[#aaaaaa]">
            <tr>
              <th className="p-3 font-medium">Image</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Stock</th>
              <th className="p-3 font-medium">Badge</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#666]">
                  Loading…
                </td>
              </tr>
            ) : (
              slice.map((p) => (
                <tr key={p.id} className="border-b border-border/60">
                  <td className="p-3">
                    <img
                      src={p.image_url}
                      alt=""
                      className="h-14 w-10 rounded object-cover"
                    />
                  </td>
                  <td className="max-w-[200px] truncate p-3 font-medium text-white">
                    {p.name}
                  </td>
                  <td className="p-3 text-[#aaaaaa]">{p.category}</td>
                  <td className="p-3 text-accent">{formatRupee(p.price)}</td>
                  <td className="p-3 text-[#aaaaaa]">
                    {p.in_stock === false ? 'No' : 'Yes'}
                  </td>
                  <td className="p-3 text-[#aaaaaa]">{p.badge || '—'}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/admin/products/edit/${p.id}`}
                        className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs text-white hover:bg-white/5"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteId(p.id)}
                        className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-red-500/40 px-3 py-2 text-xs text-red-400 hover:bg-red-950/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length === 0 && (
        <p className="mt-6 text-center text-[#666]">No products match.</p>
      )}

      <div className="mt-4 flex items-center justify-between text-sm text-[#aaaaaa]">
        <span>
          Page {pageSafe + 1} / {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={pageSafe === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-lg border border-border px-4 py-2 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={pageSafe >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-border px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete poster?"
      >
        <p className="text-sm text-[#aaaaaa]">
          This cannot be undone. Remove from catalogue?
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={confirmDelete}
            className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-500"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(null)}
            className="flex-1 rounded-xl border border-border py-3 font-medium"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </AdminLayout>
  )
}
