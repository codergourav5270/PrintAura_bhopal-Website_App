import { Package, Palette, Truck } from 'lucide-react'

const steps = [
  {
    icon: Palette,
    title: 'Choose your poster',
    body: 'Browse categories or upload your own design for a custom print.',
  },
  {
    icon: Package,
    title: 'We print with care',
    body: 'Every order is colour-checked and packed in rigid tubes or flat mailers.',
  },
  {
    icon: Truck,
    title: 'Delivered to you',
    body: 'Trackable shipping across India. COD and online payments supported.',
  },
]

export function HowItWorks() {
  return (
    <section className="border-t border-border bg-[#0d0d0d] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-2xl font-bold text-white md:text-3xl">
          How it works
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 text-center md:text-left"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent md:mx-0">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#aaaaaa]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
