import React, { memo, useMemo } from 'react'
import {
  useWebGLContext,
  useStaticBuffer,
  useAttribute,
} from '@react-vertex/core'
import { useValueSlider } from '@react-vertex/scene-helpers'
import { positions } from 'demos/models/tuna/tuna.json'

const indices = []

for (let i = 0; i < positions.length / 3; i++) {
  indices.push(i)
}

function TunaGeometry() {
  const gl = useWebGLContext()
  const positionBuffer = useStaticBuffer(gl, positions, false, 'F32')
  const position = useAttribute(gl, 3, positionBuffer)

  const indexBuffer = useStaticBuffer(gl, indices, true, 'U16')

  const attributes = useMemo(() => {
    return { position }
  }, [position])

  const scaleX = useValueSlider('Tuna Scale X:', 1, 1, 5, 0.1)
  const scaleY = useValueSlider('Tuna Scale Y:', 1, 1, 5, 0.1)
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
}

TunaGeometry.propTypes = {}

export default memo(TunaGeometry)
