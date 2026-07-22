import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Masthead } from '#/components/specimen/Masthead'
import { UploadZone } from '#/components/specimen/UploadZone'
import { PreviewStrip } from '#/components/specimen/PreviewStrip'
import { ScanCard } from '#/components/specimen/ScanCard'
import { ErrorPanel } from '#/components/specimen/ErrorPanel'
import { ResultsSheet } from '#/components/specimen/ResultsSheet'
import { Toast } from '#/components/specimen/Toast'
import { downscaleImage } from '#/lib/downscaleImage'
import { copyToClipboard } from '#/lib/copyToClipboard'
import { extractTokens } from '#/server/extractTokens'
import type { DesignTokens } from '#/lib/tokens'

export const Route = createFileRoute('/')({ component: Home })

type LoadedImage = {
  file: File
  url: string
  width: number
  height: number
}

type Phase = 'idle' | 'ready' | 'scanning' | 'results' | 'error'

function toastTextFor(value: string): string {
  const trimmed = value.trim()
  return trimmed.length <= 32 ? `Copied ${trimmed}` : 'Copied to clipboard'
}

function Home() {
  const [image, setImage] = useState<LoadedImage | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [tokens, setTokens] = useState<DesignTokens | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [rejectMessage, setRejectMessage] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | null>(null)
  const imageUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
      if (toastTimer.current) window.clearTimeout(toastTimer.current)
    }
  }, [])

  const showToast = (message: string) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 1400)
  }

  const handleCopy = async (value: string) => {
    const ok = await copyToClipboard(value)
    if (ok) showToast(toastTextFor(value))
  }

  const handleFileSelected = (file: File) => {
    setRejectMessage('')
    const url = URL.createObjectURL(file)
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
    imageUrlRef.current = url

    const probe = new Image()
    probe.onload = () => {
      setImage({ file, url, width: probe.naturalWidth, height: probe.naturalHeight })
      setPhase('ready')
      setTokens(null)
      setErrorMessage('')
    }
    probe.onerror = () => {
      setRejectMessage('Could not read that image — try a different file.')
      URL.revokeObjectURL(url)
      imageUrlRef.current = null
    }
    probe.src = url
  }

  const handleReset = () => {
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
    imageUrlRef.current = null
    setImage(null)
    setPhase('idle')
    setTokens(null)
    setErrorMessage('')
    setRejectMessage('')
  }

  const handleExtract = async () => {
    if (!image) return
    setPhase('scanning')
    setErrorMessage('')

    try {
      const downscaled = await downscaleImage(image.file)
      const result = await extractTokens({
        data: { imageBase64: downscaled.base64, mediaType: downscaled.mediaType },
      })

      if (result.ok) {
        setTokens(result.tokens as DesignTokens)
        setPhase('results')
      } else {
        setErrorMessage(result.error || 'Analysis failed — try again, or try a smaller crop of the image.')
        setPhase('error')
      }
    } catch {
      setErrorMessage('Analysis failed — try again, or try a smaller crop of the image.')
      setPhase('error')
    }
  }

  return (
    <div className="specimen-app">
      <Masthead />

      <main className="specimen-shell specimen-main">
        {phase === 'idle' ? (
          <>
            <UploadZone onFileSelected={handleFileSelected} onRejected={setRejectMessage} />
            {rejectMessage ? <ErrorPanel message={rejectMessage} onRetry={() => setRejectMessage('')} /> : null}
          </>
        ) : null}

        {image && phase !== 'idle' ? (
          <PreviewStrip
            imageUrl={image.url}
            fileName={image.file.name}
            width={image.width}
            height={image.height}
            onExtract={handleExtract}
            onReset={handleReset}
            extracting={phase === 'scanning'}
          />
        ) : null}

        {phase === 'scanning' ? <ScanCard /> : null}

        {phase === 'error' ? <ErrorPanel message={errorMessage} onRetry={handleExtract} /> : null}

        {phase === 'results' && tokens ? <ResultsSheet tokens={tokens} onCopy={handleCopy} /> : null}
      </main>

      <Toast message={toast} />
    </div>
  )
}
