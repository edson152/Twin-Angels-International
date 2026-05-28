/**
 * Compress and resize an image file to a web-friendly size before storing.
 * Returns a base64 data URL of the compressed image.
 * Max width: 1200px, quality: 0.82 (JPEG)
 */
export function compressImage(file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let w = img.width
        let h = img.height
        if (w > maxWidth) {
          h = Math.round((h * maxWidth) / w)
          w = maxWidth
        }
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, w, h)
        // Use JPEG for photos (smaller), PNG for logos
        const mimeType = file.type === 'image/png' && file.size < 200_000 ? 'image/png' : 'image/jpeg'
        resolve(canvas.toDataURL(mimeType, quality))
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
