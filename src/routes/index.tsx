import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Masthead } from '#/components/specimen/Masthead'
import { UploadZone } from '#/components/specimen/UploadZone'
import { PreviewStrip } from '#/components/specimen/PreviewStrip'
import { ScanCard } from '#/components/specimen/ScanCard'
import { ErrorPanel } from '#/components/specimen/ErrorPanel'
import { ResultsSheet } from '#/components/specimen/ResultsSheet'
import { Toast } from '#/components/specimen/Toast'
import { downscaleImage, createThumbnail } from '#/lib/downscaleImage'
import { useCopyToast } from '#/lib/useCopyToast'
import { saveHistoryEntry } from '#/lib/history'
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

function Home() {
  const [image, setImage] = useState<LoadedImage | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [tokens, setTokens] = useState<DesignTokens | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [rejectMessage, setRejectMessage] = useState('')
  const { toast, copy } = useCopyToast()
  const imageUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
    }
  }, [])

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
        const tokens = result.tokens as DesignTokens
        setTokens(tokens)
        setPhase('results')

        try {
          const thumbnail = await createThumbnail(image.file)
          saveHistoryEntry({
            fileName: image.file.name,
            thumbnail,
            width: image.width,
            height: image.height,
            tokens,
          })
        } catch {
          // history is a convenience, not critical — a failed thumbnail shouldn't block results
        }
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

        {phase === 'results' && tokens ? <ResultsSheet tokens={tokens} onCopy={copy} /> : null}
      </main>

      <Toast message={toast} />
    </div>
  )
}
