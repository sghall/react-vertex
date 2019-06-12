import { useMemo } from 'react'

const { PI, sin, cos } = Math

const angle = (PI * 2) / 3
const scale = 0.015

// prettier-ignore
const particle0 = [
  sin(angle * 2), cos(angle * 2), 0,
  sin(angle), cos(angle), 0,
  sin(angle * 3), cos(angle * 3), 0,
].map(d => d * scale)

// prettier-ignore
const particle1 = [
  sin(angle * 2 + PI), cos(angle * 2 + PI), 0,
  sin(angle + PI), cos(angle + PI), 0,
  sin(angle * 3 + PI), cos(angle * 3 + PI), 0,
].map(d => d * scale)

export function useParticleGeometry(size) {
  const memoized = useMemo(() => {
    const instanceCount = size * size

    const vertices0 = []
    const vertices1 = []
    const colors = []
    const uvs = []

    for (let i = 0; i < instanceCount; i++) {
      const x = (i % size) / size
      const y = Math.floor(i / size) / size

      const color = [1, x, y]
      const uv = [x, y]

      for (let j = 0; j < 3; j++) {
        if (i % 2 === 0) {
          vertices0.push(
            particle0[j * 3 + 0],
            particle0[j * 3 + 1],
            particle0[j * 3 + 2],
          )
          vertices1.push(
            particle1[j * 3 + 0],
            particle1[j * 3 + 1],
            particle1[j * 3 + 2],
          )
        } else {
          vertices1.push(
            particle0[j * 3 + 0],
            particle0[j * 3 + 1],
            particle0[j * 3 + 2],
          )
          vertices0.push(
            particle1[j * 3 + 0],
            particle1[j * 3 + 1],
            particle1[j * 3 + 2],
          )
        }

        colors.push(...color)
        uvs.push(...uv)
      }
    }

    return { instanceCount, vertices0, vertices1, colors, uvs }
  }, [size])

  return memoized
}
