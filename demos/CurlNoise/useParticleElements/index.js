import { useMemo } from 'react'
import {
  useWebGLContext,
  useStaticBuffer,
  useAttribute,
} from '@react-vertex/core'
import { useBirdGeometry } from './geometry'

export default function useParticleElements(size) {
  const birds = useBirdGeometry(size)

  const gl = useWebGLContext()

  const position0Buffer = useStaticBuffer(gl, birds.vertices0, false, 'F32')
  const position0 = useAttribute(gl, 3, position0Buffer)

  const position1Buffer = useStaticBuffer(gl, birds.vertices1, false, 'F32')
  const position1 = useAttribute(gl, 3, position1Buffer)

  const uvsBuffer = useStaticBuffer(gl, birds.uvs, false, 'F32')
  const uv = useAttribute(gl, 2, uvsBuffer)

  const colorsBuffer = useStaticBuffer(gl, birds.colors, false, 'F32')
  const color = useAttribute(gl, 3, colorsBuffer)

  const memoized = useMemo(
    () => ({
      attributes: { position0, position1, color, uv },
      drawArrays: { count: birds.vertices0.length / 4 },
    }),
    [birds, position0, position1, color, uv],
  )

  return memoized
}
