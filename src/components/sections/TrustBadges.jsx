import { Leaf, Shield, Sparkles, Truck, Zap } from 'lucide-react'

const items = [
  { icon: Truck, label: 'Pan-India delivery' },
  { icon: Shield, label: 'Secure packaging' },
  { icon: Sparkles, label: 'Archival print' },
  { icon: Leaf, label: 'Eco-friendly inks' },
  { icon: Zap, label: 'Fast dispatch' },
]

export function TrustBadges() {
  return (
    <section className="border-b border-border bg-[#0f0f0f] py-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 sm:gap-10 md:justify-between">
        {items.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex min-h-[44px] items-center gap-2 text-sm text-[#aaaaaa]"
          >
            <Icon className="h-5 w-5 shrink-0 text-accent" aria-hidden />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
