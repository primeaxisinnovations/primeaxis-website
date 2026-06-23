interface Orb {
  color: string
  size: number
  top?: string
  bottom?: string
  left?: string
  right?: string
}

interface GlassOrbsProps {
  orbs: Orb[]
}

// Blurred radial-gradient depth layer for dark glass-card sections —
// purely decorative, so pointer-events-none + aria-hidden keep it out
// of interaction and the accessibility tree.
export default function GlassOrbs({ orbs }: GlassOrbsProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            bottom: orb.bottom,
            left: orb.left,
            right: orb.right,
            background: orb.color,
            filter: 'blur(90px)',
          }}
        />
      ))}
    </div>
  )
}
