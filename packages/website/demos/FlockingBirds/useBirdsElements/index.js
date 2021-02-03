import { useMemo } from 'react'
import {
  useWebGLContext,
  useStaticBuffer,
  useAttribute,
} from '@react-vertex/core'
import { useBirdGeometry } from './geometry'

export default function useBirdsElements(size) {
  const birds = useBirdGeometry(size)

  const gl = useWebGLContext()

  const positionBuffer = useStaticBuffer(gl, birds.vertices, false, 'F32')
  const position = useAttribute(gl, 4, positionBuffer)

  const uvsBuffer = useStaticBuffer(gl, birds.uvs, false, 'F32')
  const uv = useAttribute(gl, 2, uvsBuffer)

  const colorsBuffer = useStaticBuffer(gl, birds.colors, false, 'F32')
  const color = useAttribute(gl, 3, colorsBuffer)

  const memoized = useMemo(
    () => ({
      attributes: { position, color, uv },
      drawArrays: { count: birds.vertices.length / 4 },
    }),
    [birds, position, color, uv],
  )

  return memoized
}
