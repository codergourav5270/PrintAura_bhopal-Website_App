/**
 * One-time seed: open devtools on http://localhost:5173 and run:
 *   const m = await import('/src/lib/seed.js'); await m.runSeed();
 *
 * Or from any component: import { runSeed } from './lib/seed.js'; await runSeed();
 */
import { seedProducts } from '../data/seedProducts.js'
import { supabase } from './supabase.js'

export async function runSeed() {
  const { data, error } = await supabase.from('products').insert(seedProducts).select()
  if (error) {
    console.error('Seed error:', error)
    return { ok: false, error }
  }
  console.log('Inserted products:', data?.length ?? seedProducts.length)
  return { ok: true, data }
}

if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.runPosterGalaxySeed = runSeed
}
