import { useEffect, useRef, useState } from 'react'
import { copyToClipboard } from './copyToClipboard'

function toastTextFor(value: string): string {
  const trimmed = value.trim()
  return trimmed.length <= 32 ? `Copied ${trimmed}` : 'Copied to clipboard'
}

export function useCopyToast() {
  const [toast, setToast] = useState<string | null>(null)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  const copy = async (value: string) => {
    const ok = await copyToClipboard(value)
    if (!ok) return
    setToast(toastTextFor(value))
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(null), 1400)
  }

  return { toast, copy }
}
