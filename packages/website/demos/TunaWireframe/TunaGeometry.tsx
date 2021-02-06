import React from 'react'
import {
  useWebGLContext,
  useStaticBuffer,
  useAttribute,
} from '@react-vertex/core'
import { useValueSlider } from '@react-vertex/scene-helpers'
import { positions } from '../models/tuna/tuna.json'

const indices: number[] = []

for (let i = 0; i < positions.length / 3; i++) {
  indices.push(i)
}

export const TunaGeometry = React.memo(() => {
  const gl = useWebGLContext()
  const positionBuffer = useStaticBuffer(gl, positions, false, 'F32')
  const position = useAttribute(gl, 3, positionBuffer)

  const indexBuffer = useStaticBuffer(gl, indices, true, 'U16')

  const attributes = React.useMemo(() => {
    return { position }
  }, [position])

  const scaleX = useValueSlider('Tuna Scale X:', 1, 1, 5, 0.1)
  const scaleY = useValueSlider('Tuna Scale Y:', 3, 1, 5, 0.1)
  const scaleZ = useValueSlider('Tuna Scale Z:', 1, 1, 5, 0.1)

  return (
    <geometry
      drawElements={{
        mode: 'LINES',
        count: indices.length,
      }}
      scale={[scaleX, scaleY, scaleZ]}
      index={indexBuffer}
      attributes={attributes}
    />
  )
})
