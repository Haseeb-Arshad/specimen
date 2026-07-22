import { useEffect, useState } from 'react'

const STATUS_LINES = [
  'Sampling pixel data…',
  'Reading color fields…',
  'Measuring radii + borders…',
  'Detecting blur, opacity, shadows…',
  'Classifying visual style…',
  'Writing CSS variables…',
]

export function ScanCard() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % STATUS_LINES.length)
    }, 1500)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="scan-card" role="status" aria-live="polite">
      <div className="scan-status mono">{STATUS_LINES[index]}</div>
      <div className="scan-sweep">
        <div className="scan-sweep-bar" />
      </div>
    </div>
  )
}
