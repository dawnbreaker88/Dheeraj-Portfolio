export interface CloudinaryOptions {
  width?: number
  height?: number
  quality?: 'auto' | 'auto:good' | 'auto:eco' | 'auto:low' | number
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'mp4'
  crop?: string
}

/**
 * Transforms Cloudinary asset URLs to use optimal format (f_auto), quality (q_auto),
 * and width sizing to dramatically speed up network loading.
 */
export function getCloudinaryUrl(url: string, options: CloudinaryOptions = {}): string {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url
  }

  const quality = options.quality || 'auto'
  const format = options.format || 'auto'
  const width = options.width
  const crop = options.crop || (width ? 'c_limit' : undefined)

  const params: string[] = [`f_${format}`, `q_${quality}`]
  if (width) params.push(`w_${width}`)
  if (crop) params.push(crop)

  const paramStr = params.join(',')

  // If url already has f_auto & q_auto, don't duplicate
  if (url.includes('/image/upload/f_auto') || url.includes('/video/upload/f_auto')) {
    return url
  }

  if (url.includes('/image/upload/')) {
    return url.replace('/image/upload/', `/image/upload/${paramStr}/`)
  }

  if (url.includes('/video/upload/')) {
    return url.replace('/video/upload/', `/video/upload/${paramStr}/`)
  }

  return url
}
