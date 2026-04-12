import { Upload, Printer, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CustomPosterCta() {
  return (
    <section className="md:mx-auto md:max-w-7xl"
    style={{ background: '#f5f0e8', position: 'relative' }}>

      <div className="relative px-6 py-14 lg:px-16">

        <h2 className="text-center text-3xl font-black text-black md:text-5xl leading-tight mb-4">
          Custom Poster
        </h2>

        <p className="mt-4 text-center text-sm text-black max-w-lg mx-auto">
          Upload your image — we'll proof, print, and deliver with premium finish.
        </p>

        {/* 3 steps */}
        <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6B0F1A]/30 border border-[#6B0F1A]/50">
              <Upload className="h-5 w-5 text-[#6B0F1A]" />
            </div>
            <p className="mt-2 text-xs text-black">Upload</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6B0F1A]/30 border border-[#6B0F1A]/50">
              <Printer className="h-5 w-5 text-[#6B0F1A]" />
            </div>
            <p className="mt-2 text-xs text-black">We Print</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6B0F1A]/30 border border-[#6B0F1A]/50">
              <Truck className="h-5 w-5 text-[#6B0F1A]" />
            </div>
            <p className="mt-2 text-xs text-black">Delivered</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/custom-poster"
            className="inline-flex min-h-[52px] items-center justify-center rounded-xl px-10 py-3 font-bold text-white hover:opacity-90 transition"
            style={{ background: '#6B0F1A', fontSize: '1rem' }}
          >
            Start Custom Order →
          </Link>
        </div>

      </div>
    </section>
  )
}
