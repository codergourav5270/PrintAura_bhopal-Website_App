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
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex justify-center w-full">
          <div className="bg-[#f5f0e8] rounded-2xl px-6 py-3 text-center">
            <h2 className="text-2xl font-bold text-[#7b1c1c] md:text-3xl">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-sm text-[#7b1c1c]">{subtitle}</p>
            )}
          </div>
        </div>image.png
        <Link
          to={viewAllTo}
          className="text-sm font-medium text-accent hover:underline shrink-0"
          style={{ textAlign: 'right', lineHeight: '1.3' }}
        >
          <span style={{ display: 'block' }}>View all</span>
          <span style={{ display: 'block' }}>new posters</span>
        </Link>
      </div>
      {error && (
        <p className="mt-6 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
          {error}
        </p>
      )}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 mx-auto max-w-4xl">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : (products || []).slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} showToast={showToast} />
            ))}
      </div>
    </section>
  )
}
