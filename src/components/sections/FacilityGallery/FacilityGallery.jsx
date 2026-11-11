import ImageSlot from "../../ui/ImageSlot/ImageSlot"
import { facilityPhotos } from "../../../data/content"
import "./FacilityGallery.css"

const MIN_ITEMS_PER_SET = 6

/** Ulangi daftar foto sampai satu set cukup panjang untuk mengisi layar lebar. */
function buildLoopSet(items) {
  if (items.length === 0) return []
  const set = []
  while (set.length < MIN_ITEMS_PER_SET) set.push(...items)
  return set
}

export default function FacilityGallery() {
  const loopSet = buildLoopSet(facilityPhotos)
  // Set digandakan supaya animasi translateX(-50%) bisa berulang tanpa sambungan.
  const items = [...loopSet, ...loopSet]

  return (
    <div className="gallery">
      <ul className="gallery__track" aria-label="Foto kondisi fasilitas umum">
        {items.map((photo, index) => {
          const isDuplicate = index >= facilityPhotos.length
          return (
            <li
              key={`${photo.slot}-${index}`}
              className="gallery__item"
              aria-hidden={isDuplicate ? "true" : undefined}
            >
              <figure className="gallery__card">
                <ImageSlot
                  slot={photo.slot}
                  tone="card"
                  className="gallery__image"
                  decorative={isDuplicate}
                  eager
                />
                <figcaption className="gallery__caption">
                  {photo.caption}
                </figcaption>
              </figure>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
