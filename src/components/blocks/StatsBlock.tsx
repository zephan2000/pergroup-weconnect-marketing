/**
 * StatsBlock — stats bar with warm gradient background.
 * Adapted from per-group-connect-main StatsBar.
 * Server component.
 */

type StatItem = {
  number: string
  label: string
  chineseLabel?: string
}

type StatsBlockProps = {
  stats: StatItem[]
}

export default function StatsBlock({ stats = [] }: StatsBlockProps) {
  return (
    <section className="bg-gradient-to-r from-amber/5 to-deep-orange/5 py-12 border-y border-line reveal">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="font-sora font-extrabold text-3xl md:text-4xl text-amber">
              {stat.number}
            </div>
            <div className="text-pg-text text-sm font-semibold mt-1">{stat.label}</div>
            {stat.chineseLabel && (
              <div className="font-noto-sans-sc text-muted text-xs mt-0.5">
                {stat.chineseLabel}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
