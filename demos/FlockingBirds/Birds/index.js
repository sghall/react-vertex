import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  useWebGLContext,
  useProgram,
  useStaticBuffer,
  useAttribute,
  useInstancedAttribute,
  useUniform1f,
} from '@react-vertex/core'
import vert from './vert.glsl'
import frag from './frag.glsl'
import * as geometry from './geometry'

function Birds({ elapsed }) {
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)

  useUniform1f(gl, program, 'elapsed', elapsed * 0.003)

  const positionBuffer = useStaticBuffer(gl, geometry.positions, false, 'F32')
  const position = useAttribute(gl, 4, positionBuffer)
  
  const offsetsBuffer = useStaticBuffer(gl, geometry.offsets, false, 'F32')
  const offset = useInstancedAttribute(gl, 3, offsetsBuffer)

  const colorsBuffer = useStaticBuffer(gl, geometry.colors, false, 'F32')
  const color = useInstancedAttribute(gl, 4, colorsBuffer)

  const indexBuffer = useStaticBuffer(gl, geometry.indices, true, 'U16')

  const attributes = useMemo(() => ({
    position, color, offset 
  }), [position, color, offset])

  return (
    <material program={program}>
      <instancedgeometry
        index={indexBuffer}
        attributes={attributes}
        drawElements={{
          count: geometry.indices.length,
          primcount: geometry.instanceCount,
        }}      
      />
    </material>
  )
}

Birds.propTypes = {
  elapsed: PropTypes.number.isRequired
}

export default Birds
