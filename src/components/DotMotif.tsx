/**
 * Decorative sunburst dot motif matching the E-Harbor logo pattern.
 * Used as a subtle watermark/background accent throughout the app.
 */
const DotMotif = ({ className = '', opacity = 0.06 }: { className?: string; opacity?: number }) => {
  const cx = 60
  const cy = 60

  const amber = 'hsl(36, 90%, 47%)'
  const orange = 'hsl(20, 75%, 48%)'
  const red = 'hsl(7, 72%, 48%)'

  const rings: [number, number, string, number, number][] = [
    [0, 5, amber, 1, 0],
    [14, 3.5, orange, 5, 0],
    [27, 2.8, amber, 8, 22.5],
    [40, 2.2, red, 12, 15],
    [52, 1.6, orange, 16, 11.25],
  ]

  const dots: { x: number; y: number; r: number; fill: string }[] = []

  rings.forEach(([radius, dotR, fill, count, offsetDeg]) => {
    if (radius === 0) {
      dots.push({ x: cx, y: cy, r: dotR, fill })
    } else {
      for (let i = 0; i < count; i++) {
        const angle = (offsetDeg + (360 / count) * i) * (Math.PI / 180)
        dots.push({
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
          r: dotR,
          fill,
        })
      }
    }
  })

  return (
    <svg className={className} width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ opacity }}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.fill} />
      ))}
    </svg>
  )
}

export default DotMotif
