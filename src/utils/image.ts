import { AllowedImageMime, ALLOWED_IMAGE_MIMES, MAX_IMAGE_BYTES } from '@/types/product.types'

export interface ImageValidationError {
  code: 'mime' | 'size' | 'read'
  message: string
}

export function validateImage(file: File): ImageValidationError | null {
  if (!ALLOWED_IMAGE_MIMES.includes(file.type as AllowedImageMime)) {
    return { code: 'mime', message: 'Faqat JPG, PNG yoki WEBP fayllar' }
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { code: 'size', message: 'Fayl hajmi 5 MB dan katta' }
  }
  return null
}

const MAX_DIMENSION = 1600

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Faylni ochib bo'lmadi"))
    }
    img.src = url
  })

export async function compressImage(file: File): Promise<File> {
  if (file.type === 'image/png' && file.size <= MAX_IMAGE_BYTES) {
    return file
  }

  const img = await loadImage(file)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height))
  const w = Math.round(img.width * scale)
  const h = Math.round(img.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.drawImage(img, 0, 0, w, h)

  const targetMime: AllowedImageMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
  let quality = 0.9
  let blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, targetMime, quality))

  while (blob && blob.size > MAX_IMAGE_BYTES && quality > 0.5) {
    quality -= 0.1
    blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, targetMime, quality))
  }

  if (!blob) return file
  if (blob.size >= file.size) return file

  const ext = targetMime === 'image/png' ? 'png' : 'jpg'
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image'
  return new File([blob], `${baseName}.${ext}`, { type: targetMime })
}
