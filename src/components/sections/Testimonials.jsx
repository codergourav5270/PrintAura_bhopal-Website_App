const reviews = [
  {
    name: 'Ananya K.',
    city: 'Bangalore',
    text: 'The print quality is insane — colours pop perfectly on my accent wall. Delivered in 4 days.',
  },
  {
    name: 'Rohan Mehta',
    city: 'Delhi',
    text: 'Ordered anime posters for my studio. Packaging was bomb-proof. Already placing a second order.',
  },
  {
    name: 'Priya S.',
    city: 'Pune',
    text: 'COD was smooth, support replied on WhatsApp in minutes. Feels like a premium Indian brand.',
  },
]

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="text-center text-2xl font-bold text-white md:text-3xl">
        Loved by collectors
      </h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {reviews.map((r) => (
          <blockquote
            key={r.name}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <p className="text-sm leading-relaxed text-[#cccccc]">&ldquo;{r.text}&rdquo;</p>
            <footer className="mt-4 text-sm">
              <span className="font-semibold text-white">{r.name}</span>
              <span className="text-[#666]"> · {r.city}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
