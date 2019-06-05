import { useMemo } from 'react'

export function useBirdGeometry(size) {
  const memoized = useMemo(() => {
    const instanceCount = size * size

    const scale = 0.15

    const w = 30 * scale
    const d = 12 * scale
    const k = 20 * scale

    const vertType1 = 1
    const vertType2 = 2
    const vertType3 = 3

    // prettier-ignore
    const vertices = [
      // BODY
      -k, 0, 0, vertType1, -k, -6 * scale, 0, vertType1, 25 * scale, 0, 0, vertType1,
      // LEFT WING
      -d, 0, 0, vertType1, +d, 0, 0, vertType1, +d, 0, +w, vertType2,
      -d, 0, +w, vertType2, -d, 0, 0, vertType1, +d, 0, +w, vertType2,
      +d, 0, +w, vertType2, -d, 0, +w * 1.5, vertType3, -d, 0, +w, vertType2,
      
      // RIGHT WING
      +d, 0, 0, vertType1, -d, 0, 0, vertType1, -d, 0, -w, vertType2, 
      +d, 0, -w, vertType2, +d, 0, 0, vertType1, -d, 0, -w, vertType2,
      -d, 0, -w, vertType2, -d, 0, -w * 1.5, vertType3, +d, 0, -w, vertType2,
    ]

    // prettier-ignore
    const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

    const colors = []
    const uvs = []

    for (let i = 0; i < instanceCount; i++) {
      const x = (i % size) / size
      const y = Math.floor(i / size) / size

      colors[i * 3 + 0] = Math.max(x, 1 - x)
      colors[i * 3 + 1] = Math.random()
      colors[i * 3 + 2] = 1

      uvs[i * 2 + 0] = x
      uvs[i * 2 + 1] = y
    }

    return { instanceCount, indices, vertices, colors, uvs }
  }, [size])

  return memoized
}
