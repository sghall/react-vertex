import { useMemo } from 'react'
import {
  useWebGLContext,
  useStaticBuffer,
  useAttribute,
  useInstancedAttribute,
} from '@react-vertex/core'
import { useBirdGeometry } from './geometry'

export default function useBirdsElements(size) {
  const birds = useBirdGeometry(size)

  const gl = useWebGLContext()

  const positionBuffer = useStaticBuffer(gl, birds.vertices, false, 'F32')
  const position = useAttribute(gl, 4, positionBuffer)

  const uvsBuffer = useStaticBuffer(gl, birds.uvs, false, 'F32')
  const uv = useInstancedAttribute(gl, 2, uvsBuffer)

  const colorsBuffer = useStaticBuffer(gl, birds.colors, false, 'F32')
  const color = useInstancedAttribute(gl, 3, colorsBuffer)

  const indexBuffer = useStaticBuffer(gl, birds.indices, true, 'U16')

  const memoized = useMemo(
    () => ({
      index: indexBuffer,
      attributes: { position, color, uv },
      drawElements: {
        count: birds.indices.length,
        primcount: birds.instanceCount,
      },
    }),
    [birds, indexBuffer, position, color, uv],
  )

  return memoized
}
