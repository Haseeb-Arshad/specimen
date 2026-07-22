type PreviewStripProps = {
  imageUrl: string
  fileName: string
  width: number
  height: number
  onExtract: () => void
  onReset: () => void
  extracting: boolean
}

export function PreviewStrip({
  imageUrl,
  fileName,
  width,
  height,
  onExtract,
  onReset,
  extracting,
}: PreviewStripProps) {
  return (
    <div className="preview-strip">
      <div className="preview-slide">
        <div className="preview-slide-frame">
          <img src={imageUrl} alt={`Uploaded specimen: ${fileName}`} />
        </div>
        <div className="preview-caption mono">
          <span className="preview-caption-name" title={fileName}>
            {fileName}
          </span>
          <span className="preview-caption-dims">
            {width} &times; {height}px
          </span>
        </div>
      </div>

      <div className="preview-details">
        <p className="preview-explainer">
          Specimen reads this image pixel by pixel and returns the complete design system hiding
          inside it — exact hex colors, gradients, radii, shadows, blur, typography, and a
          ready-to-paste CSS block.
        </p>
        <div className="preview-actions">
          <button type="button" className="btn btn-solid" onClick={onExtract} disabled={extracting}>
            Extract tokens
          </button>
          <button type="button" className="btn btn-ghost" onClick={onReset} disabled={extracting}>
            New image
          </button>
        </div>
      </div>
    </div>
  )
}
