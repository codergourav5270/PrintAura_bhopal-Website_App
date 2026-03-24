export function AnnouncementBar() {
  return (
    <div className="relative z-[60] overflow-hidden border-b border-border bg-[#141414] py-2 text-center text-xs text-[#aaaaaa] sm:text-sm">
      <div className="animate-marquee inline-block whitespace-nowrap">
        <span className="mx-8">
          Free shipping on orders above ₹499 · Premium matte finish · COD available
          across India
        </span>
        <span className="mx-8">
          Free shipping on orders above ₹499 · Premium matte finish · COD available
          across India
        </span>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 28s linear infinite;
        }
      `}</style>
    </div>
  )
}
