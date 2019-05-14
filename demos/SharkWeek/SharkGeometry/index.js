import React, { memo, useMemo } from 'react'
import {
  useStaticBuffer,
  useAttribute,
  useWebGLContext,
  useInstancedAttribute,
} from '@react-vertex/core'
import { offsets, colors, instanceCount } from './utils'
import { positions, normals } from 'demos/models/shark/shark.json'

const indices = []

for (let i = 0; i < positions.length / 3; i++) {
  indices.push(i)
}

function SharkGeometry() {
  const gl = useWebGLContext()
  const positionBuffer = useStaticBuffer(gl, positions, false, 'F32')
  const position = useAttribute(gl, 3, positionBuffer)

  const normalBuffer = useStaticBuffer(gl, normals, false, 'F32')
  const normal = useAttribute(gl, 3, normalBuffer)

  const offsetsBuffer = useStaticBuffer(gl, offsets, false, 'F32')
  const offset = useInstancedAttribute(gl, 4, offsetsBuffer)

  const colorsBuffer = useStaticBuffer(gl, colors, false, 'F32')
  const color = useInstancedAttribute(gl, 4, colorsBuffer)

  const indexBuffer = useStaticBuffer(gl, indices, true, 'U16')

  const attributes = useMemo(() => {
    return { position, normal, offset, color }
  }, [position, normal, offset, color])

  return (
    <instancedgeometry
      drawElements={{
        mode: 'TRIANGLES',
        count: indices.length,
        primcount: instanceCount,
      }}
      index={indexBuffer}
      attributes={attributes}
    />
  )
}

SharkGeometry.propTypes = {}

export default memo(SharkGeometry)
