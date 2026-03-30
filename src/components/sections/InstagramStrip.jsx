const imgs = Array.from({ length: 6 }, (_, i) =>
  `https://placehold.co/320x320/1a1a1a/f5c518?text=IG+${i + 1}`
)

const INSTAGRAM_URL = 'https://www.instagram.com/printaura_bhopal?igsh=MWp0NDFqbnhsaHU3aA=='

export function InstagramStrip() {
  return (
    <section className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <p className="text-sm font-medium text-accent">@printaura_bhopal</p>
        <h2 className="mt-1 text-xl font-bold text-white">
          On your wall soon
        </h2>
        
          <a href={"https://www.instagram.com/printaura_bhopal?igsh=MWp0NDFqbnhsaHU3aA=="}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-black hover:opacity-90"
        >
          Follow us on Instagram
        </a>
      </div>
      <div className="mt-8 flex gap-2 overflow-x-auto px-4 pb-2 md:grid md:grid-cols-6 md:overflow-visible">
        {imgs.map((src, i) => (
          
            <a key={i} href={"https://www.instagram.com/printaura_bhopal?igsh=MWp0NDFqbnhsaHU3aA=="}
            
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-square w-40 shrink-0 overflow-hidden rounded-xl border border-border md:w-auto"
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </a>
        ))}
      </div>
    </section>
  )
}
