import { useMemo } from 'react'
import {
  useWebGLContext,
  useStaticBuffer,
  useAttribute,
} from '@react-vertex/core'
import { useParticleGeometry } from './geometry'

export default function useParticleElements(size) {
  const particles = useParticleGeometry(size)

  const gl = useWebGLContext()

  const position0Buffer = useStaticBuffer(gl, particles.vertices0, false, 'F32')
  const position0 = useAttribute(gl, 3, position0Buffer)

  const position1Buffer = useStaticBuffer(gl, particles.vertices1, false, 'F32')
  const position1 = useAttribute(gl, 3, position1Buffer)

  const uvsBuffer = useStaticBuffer(gl, particles.uvs, false, 'F32')
  const uv = useAttribute(gl, 2, uvsBuffer)

  const colorsBuffer = useStaticBuffer(gl, particles.colors, false, 'F32')
  const color = useAttribute(gl, 3, colorsBuffer)

  const memoized = useMemo(
    () => ({
      attributes: { position0, position1, color, uv },
      drawArrays: { count: particles.vertices0.length / 4 },
    }),
    [particles, position0, position1, color, uv],
  )

  return memoized
}
