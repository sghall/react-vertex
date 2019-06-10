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
    const bird = [
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

    const vertices = []
    const indices = []
    const colors = []
    const uvs = []

    let currentIndex = 0

    for (let i = 0; i < instanceCount; i++) {
      const x = (i % size) / size
      const y = Math.floor(i / size) / size

      const color = [Math.max(x, 1 - x), Math.random(), 1]
      const uv = [x, y]

      for (let j = 0; j < bird.length / 4; j++) {
        vertices.push(
          bird[j * 4 + 0],
          bird[j * 4 + 1],
          bird[j * 4 + 2],
          bird[j * 4 + 3],
        )

        indices.push(currentIndex++)
        colors.push(...color)
        uvs.push(...uv)
      }
    }

    return { instanceCount, indices, vertices, colors, uvs }
  }, [size])

  return memoized
}
