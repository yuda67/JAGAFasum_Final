import { useEffect, useRef, useState } from "react"
import { IMAGE_SLOTS, getImageUrl } from "../../../data/images"
import { ImageIcon } from "../../icons/UiIcons"
import "./ImageSlot.css"

// Label petunjuk slot hanya tampil saat development (preview), tidak di build produksi.
const SHOW_SLOT_HINTS = import.meta.env.DEV

/**
 * Wadah gambar: menampilkan file dari src/assets/images/<slot>.* bila ada,
 * atau placeholder bergaya bila belum ada.
 * tone: 'hero' | 'card' | 'auth' (menentukan gaya placeholder)
 * showHint: false untuk menyembunyikan ikon & label di dalam placeholder
 * eager: muat langsung (tanpa lazy-loading), mis. untuk galeri yang bergerak
 */
export default function ImageSlot({
  slot,
  tone = "card",
  className = "",
  alt,
  decorative = false,
  priority = false,
  eager = false,
  showHint = true,
}) {
  const src = getImageUrl(slot)
  const meta = IMAGE_SLOTS[slot] ?? { label: slot, size: "", alt: "" }
  const altText = decorative ? "" : (alt ?? meta.alt)
  const imgRef = useRef(null)
  const [loadedSrc, setLoadedSrc] = useState(null)

  // Gambar dari cache bisa selesai dimuat sebelum onLoad terpasang.
  useEffect(() => {
    const image = imgRef.current
    if (image?.complete && image.naturalWidth > 0) setLoadedSrc(src)
  }, [src])

  const classes = [
    "image-slot",
    `image-slot--${tone}`,
    src ? "has-image" : "is-empty",
    src && loadedSrc === src && "is-loaded",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={classes}>
      {src ? (
        <img
          ref={imgRef}
          className="image-slot__img"
          src={src}
          alt={altText}
          loading={priority || eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          draggable="false"
          onLoad={() => setLoadedSrc(src)}
        />
      ) : (
        <div
          className="image-slot__placeholder"
          role={decorative ? undefined : "img"}
          aria-label={decorative ? undefined : altText || meta.label}
          aria-hidden={decorative ? "true" : undefined}
        >
          {showHint && (
            <span className="image-slot__frame">
              <ImageIcon className="image-slot__icon" />
              {SHOW_SLOT_HINTS && (
                <span className="image-slot__hint">
                  <strong>{meta.label}</strong>
                  <span>src/assets/images/{slot}.jpg</span>
                  <span>{meta.size}</span>
                </span>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
