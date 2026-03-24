export function StatCard({ label, value, tone = 'neutral' }) {
  const tones = {
    golden: 'border-accent/40 bg-gradient-to-br from-[#2a2208] to-card text-accent',
    blue: 'border-blue-500/30 bg-blue-950/40 text-blue-300',
    green: 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300',
    purple: 'border-purple-500/30 bg-purple-950/40 text-purple-300',
    neutral: 'border-border bg-card text-white',
  }
  return (
    <div
      className={`rounded-2xl border p-5 ${tones[tone] || tones.neutral}`}
    >
      <p className="text-xs font-medium uppercase tracking-wide opacity-80">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  )
}
