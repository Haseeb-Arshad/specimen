export type DownscaledImage = {
  base64: string
  mediaType: 'image/jpeg'
  width: number
  height: number
}

const MAX_DIMENSION = 1400
const JPEG_QUALITY = 0.92

export function downscaleImage(file: File): Promise<DownscaledImage> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      const { width, height } = img
      const longest = Math.max(width, height)
      const scale = longest > MAX_DIMENSION ? MAX_DIMENSION / longest : 1
      const targetWidth = Math.round(width * scale)
      const targetHeight = Math.round(height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext('2d')

      URL.revokeObjectURL(objectUrl)

      if (!ctx) {
        reject(new Error('Canvas not supported'))
        return
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
      const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
      const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)

      resolve({ base64, mediaType: 'image/jpeg', width, height })
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Could not read image'))
    }

    img.src = objectUrl
  })
}
