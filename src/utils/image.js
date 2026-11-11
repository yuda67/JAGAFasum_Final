/* Validasi & kompresi foto laporan agar muat di localStorage. */
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"]
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export function validateImageFile(file) {
  if (!file) return "Pilih sebuah foto."
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type))
    return "Format foto harus PNG, JPG, atau WebP."
  if (file.size > MAX_IMAGE_BYTES) return "Ukuran foto maksimal 5 MB."
  return ""
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Foto tidak dapat dibaca. Coba file lain."))
    }
    image.src = url
  })
}

/** Perkecil foto (sisi terpanjang `maxSize` px) lalu ubah menjadi data URL JPEG. */
export async function compressImage(file, { maxSize = 1280, quality = 0.8 } = {}) {
  const image = await loadImage(file)
  const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight))
  const width = Math.round(image.naturalWidth * scale)
  const height = Math.round(image.naturalHeight * scale)

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  // Latar putih agar bagian transparan PNG tidak menjadi hitam di JPEG.
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, width, height)
  context.drawImage(image, 0, 0, width, height)

  return { dataUrl: canvas.toDataURL("image/jpeg", quality), width, height }
}

/** Foto profil: potong bagian tengah menjadi persegi `size` px lalu ubah ke data URL JPEG. */
export async function cropSquareImage(file, { size = 320, quality = 0.85 } = {}) {
  const image = await loadImage(file)
  const side = Math.min(image.naturalWidth, image.naturalHeight)
  const sx = (image.naturalWidth - side) / 2
  const sy = (image.naturalHeight - side) / 2
  const out = Math.min(size, side)

  const canvas = document.createElement("canvas")
  canvas.width = out
  canvas.height = out
  const context = canvas.getContext("2d")
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, out, out)
  context.drawImage(image, sx, sy, side, side, 0, 0, out, out)
  return canvas.toDataURL("image/jpeg", quality)
}
