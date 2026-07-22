import { useCallback, useRef, useState } from 'react'

type UploadZoneProps = {
  onFileSelected: (file: File) => void
  onRejected: (message: string) => void
}

function CropMarks() {
  return (
    <>
      <span className="crop-mark crop-mark-tl" aria-hidden="true" />
      <span className="crop-mark crop-mark-tr" aria-hidden="true" />
      <span className="crop-mark crop-mark-bl" aria-hidden="true" />
      <span className="crop-mark crop-mark-br" aria-hidden="true" />
    </>
  )
}

export function UploadZone({ onFileSelected, onRejected }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      const file = fileList?.[0]
      if (!file) return
      if (!file.type.startsWith('image/')) {
        onRejected('That file isn’t an image — drop a PNG, JPG, WebP, or similar.')
        return
      }
      onFileSelected(file)
    },
    [onFileSelected, onRejected],
  )

  const openBrowser = () => inputRef.current?.click()

  return (
    <div
      className={`upload-zone${dragOver ? ' upload-zone-drag' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Drop an image here, or press Enter to browse for a file"
      onClick={openBrowser}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openBrowser()
        }
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        handleFiles(e.dataTransfer.files)
      }}
    >
      <CropMarks />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="upload-zone-input"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          handleFiles(e.target.files)
        }}
      />
      <div className="upload-zone-heading">Drop an image here</div>
      <div className="upload-zone-sub mono">
        UI screenshot, palette, poster &mdash; anything. Click to browse.
      </div>
    </div>
  )
}
