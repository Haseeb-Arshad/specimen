export type DownscaledImage = {
  base64: string
  mediaType: 'image/jpeg'
  width: number
  height: number
}

const MAX_DIMENSION = 1400
const JPEG_QUALITY = 0.92

const THUMBNAIL_MAX_DIMENSION = 220
const THUMBNAIL_QUALITY = 0.7

function resizeToCanvas(img: HTMLImageElement, maxDimension: number): HTMLCanvasElement {
  const { width, height } = img
  const longest = Math.max(width, height)
  const scale = longest > maxDimension ? maxDimension / longest : 1
  const targetWidth = Math.round(width * scale)
  const targetHeight = Math.round(height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
  return canvas
}

function loadImage(file: File): Promise<{ img: HTMLImageElement; objectUrl: string }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve({ img, objectUrl })
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Could not read image'))
    }
    img.src = objectUrl
  })
}

export async function downscaleImage(file: File): Promise<DownscaledImage> {
  const { img, objectUrl } = await loadImage(file)
  const { width, height } = img
  try {
    const canvas = resizeToCanvas(img, MAX_DIMENSION)
    const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
    const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
    return { base64, mediaType: 'image/jpeg', width, height }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export async function createThumbnail(file: File): Promise<string> {
  const { img, objectUrl } = await loadImage(file)
  try {
    const canvas = resizeToCanvas(img, THUMBNAIL_MAX_DIMENSION)
    return canvas.toDataURL('image/jpeg', THUMBNAIL_QUALITY)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
