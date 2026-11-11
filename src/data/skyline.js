/*
 * Data ilustrasi skyline di section "Tentang".
 * Koordinat memakai viewBox 0 0 740 650 (x = x desain − 700, y = y desain − 2180).
 * Setiap blok memanjang sampai ke bawah gambar; bagian bawah tertutup footer.
 */
export const SKYLINE_SIZE = { width: 740, height: 650 }

export const skylineBuildings = [
  {
    id: "a",
    blocks: [
      { x1: 4, x2: 106, top: 420 },
      { x1: 16, x2: 92, top: 394 },
      { x1: 28, x2: 80, top: 371 },
      { x1: 40, x2: 68, top: 348 },
      { x1: 106, x2: 122, top: 556 },
    ],
    antenna: { x: 52, width: 5, top: 307, base: 348, beacon: true },
    windowSize: [10, 11],
    windows: [
      { xs: [54], ys: [387] },
      { xs: [36, 54, 73], ys: [419] },
      { xs: [21, 54, 86], from: 446, step: 25.5 },
    ],
  },
  {
    id: "b",
    blocks: [
      { x1: 144, x2: 248, top: 324, radius: 8 },
      { x1: 160, x2: 232, top: 296, radius: 12 },
      { x1: 248, x2: 296, top: 501 },
      { x1: 264, x2: 280, top: 466, radius: 3 },
    ],
    rims: [
      "144,324 160,324 160,305",
      "248,324 232,324 232,305",
      "248,501 264,501 264,468 248,476",
    ],
    windowSize: [12, 12],
    windows: [
      { xs: [171, 220], from: 348, step: 29.9 },
      { xs: [196], from: 348, step: 29.9, tones: ["off", "mint"] },
      { xs: [258], from: 526, step: 31, tones: ["off"] },
      { xs: [278], from: 526, step: 31 },
    ],
  },
  {
    id: "c",
    blocks: [
      { x1: 308, x2: 440, top: 207 },
      { x1: 320, x2: 428, top: 172 },
      { x1: 328, x2: 420, top: 134 },
      { x1: 340, x2: 408, top: 111 },
      { x1: 352, x2: 396, top: 88 },
      { x1: 360, x2: 388, top: 66 },
      { x1: 440, x2: 480, top: 404 },
      { x1: 480, x2: 492, top: 425 },
      { x1: 492, x2: 504, top: 535 },
    ],
    rims: [
      "428,207 440,207 428,180",
      "340,111 352,111 352,92",
      "480,425 492,425 480,409",
    ],
    antenna: { x: 372, width: 5, top: 3, base: 66, beacon: true },
    stripe: { x1: 371, x2: 379, top: 254 },
    windowSize: [11, 13],
    windows: [
      { xs: [376], ys: [98] },
      { xs: [356, 376, 396], ys: [140] },
      { xs: [344, 364, 385, 406], ys: [186] },
      { xs: [330, 354, 376, 397, 420], ys: [229] },
      { xs: [330, 354, 396, 420], from: 261, step: 33.4 },
      { xs: [454, 474], from: 446, step: 30.5 },
    ],
  },
  {
    id: "d",
    blocks: [
      { x1: 528, x2: 676, top: 215, radius: 8 },
      { x1: 544, x2: 660, top: 188, radius: 14 },
    ],
    rims: ["528,215 544,215 544,196", "676,215 660,215 660,196"],
    antenna: { x: 644, width: 4, top: 160, base: 188 },
    windowSize: [11, 12],
    windows: [
      {
        xs: [548, 567, 585, 603, 621, 639, 657],
        from: 236,
        step: 29,
        density: 0.86,
      },
    ],
  },
  {
    id: "e",
    blocks: [
      { x1: 688, x2: 800, top: 429 },
      { x1: 704, x2: 790, top: 364 },
      { x1: 716, x2: 780, top: 344 },
      { x1: 736, x2: 770, top: 323 },
    ],
    windowSize: [10, 12],
    windows: [
      { xs: [720, 736], ys: [386] },
      { xs: [720], ys: [414, 450] },
      { xs: [711, 729], from: 478, step: 28 },
    ],
  },
]
