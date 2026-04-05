export function HowItWorks() {
  return (
    <section className="border-t border-border py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-black text-black md:text-4xl tracking-wide uppercase">
          Why Choose Us?
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">

          {/* Quality Guaranteed */}
          <div className="flex flex-col items-center text-center px-4">
            <div className="text-5xl mb-3">🏅</div>
            <h3 className="text-lg font-bold text-black">Quality Guaranteed</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#555]">
              Quality is our top priority. Each poster is meticulously crafted using premium materials.
            </p>
          </div>

          {/* Custom Creations */}
          <div className="flex flex-col items-center text-center px-4">
            <div className="text-5xl mb-3">🖼️</div>
            <h3 className="text-lg font-bold text-black">Custom Creations</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#555]">
              Upload your own images or designs and create personalized posters that reflect your personality.
            </p>
          </div>

          {/* Exclusive Offers */}
          <div className="flex flex-col items-center text-center px-4">
            <div className="text-5xl mb-3">🎟️</div>
            <h3 className="text-lg font-bold text-black">Exclusive Offers</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#555]">
              We're constantly rolling out exciting offers to help you save big on your favorite designs.
            </p>
          </div>

          {/* Free Shipping */}
          <div className="flex flex-col items-center text-center px-4">
            <div className="text-5xl mb-3">⭐</div>
            <h3 className="text-lg font-bold text-black">Free Shipping</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#555]">
              Enjoy free delivery on prepaid orders — no shipping fees mean more savings and convenience for you!
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
