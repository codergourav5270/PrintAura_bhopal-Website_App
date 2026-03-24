import { CATEGORIES } from '../lib/supabase.js'

const BADGES = ['NEW', 'BESTSELLER', 'SALE', null, null]
const SIZE_LABELS = ['A4', 'A3', 'A2', 'A1', '12x18', '18x24', '24x36']

function sizesFor(base) {
  return SIZE_LABELS.map((label, i) => ({
    label,
    price: Math.min(699, Math.max(199, base + i * 45)),
  }))
}

/** 20 sample posters — run `runSeed()` from `src/lib/seed.js` once after DB is ready */
export const seedProducts = Array.from({ length: 20 }, (_, i) => {
  const cat = CATEGORIES[i % CATEGORIES.length]
  const base = 199 + ((i * 37) % 500)
  const orig = base + 100 + ((i * 13) % 200)
  return {
    name: `${cat} Collector #${i + 1}`,
    description: `Archival matte poster — ${cat} theme. Ships in a rigid tube with edge protection.`,
    category: cat,
    tags: [cat, 'poster', 'india', 'premium'],
    price: base,
    original_price: orig,
    image_url: `https://placehold.co/400x533/1a1a1a/f5c518?text=${encodeURIComponent(`${cat}+${i + 1}`)}`,
    sizes: sizesFor(base),
    badge: BADGES[i % BADGES.length],
    in_stock: i % 17 !== 0,
  }
})
