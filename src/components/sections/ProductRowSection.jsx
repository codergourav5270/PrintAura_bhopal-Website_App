import { Link } from 'react-router-dom'
import { ProductCard } from '../ui/ProductCard.jsx'
import { SkeletonCard } from '../ui/Skeleton.jsx'

export function ProductRowSection({
  title,
  subtitle,
  products,
  loading,
  error,
  showToast,
  viewAllTo = '/shop',
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-[#aaaaaa]">{subtitle}</p>
          )}
        </div>
        <Link
          to={viewAllTo}
          className="text-sm font-medium text-accent hover:underline"
        >
          View all
        </Link>
      </div>
      {error && (
        <p className="mt-6 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
          {error}
        </p>
      )}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : (products || []).slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} showToast={showToast} />
            ))}
      </div>
    </section>
  )
}
