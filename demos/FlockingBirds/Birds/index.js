import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  useWebGLContext,
  useProgram,
  useStaticBuffer,
  useAttribute,
  useInstancedAttribute,
  useUniform1f,
  useUniformSampler2d,
} from '@react-vertex/core'
import vert from './vert'
import frag from './frag'
import birdGeometry from './geometry'

const size = 32
const birds = birdGeometry(size)

function Birds({ elapsed, texPosition, texVelocity }) {
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)

  useUniform1f(gl, program, 'elapsed', elapsed)
  useUniformSampler2d(gl, program, 'texPosition', texPosition)
  useUniformSampler2d(gl, program, 'texVelocity', texVelocity)

  const positionBuffer = useStaticBuffer(gl, birds.vertices, false, 'F32')
  const position = useAttribute(gl, 4, positionBuffer)

  const uvsBuffer = useStaticBuffer(gl, birds.uvs, false, 'F32')
  const uv = useInstancedAttribute(gl, 2, uvsBuffer)

  const colorsBuffer = useStaticBuffer(gl, birds.colors, false, 'F32')
  const color = useInstancedAttribute(gl, 3, colorsBuffer)

  const indexBuffer = useStaticBuffer(gl, birds.indices, true, 'U16')

  const attributes = useMemo(
    () => ({
      position,
      color,
      uv,
    }),
    [position, color, uv],
  )

  return (
    <material program={program}>
      <instancedgeometry
        index={indexBuffer}
        attributes={attributes}
        drawElements={{
          count: birds.indices.length,
          primcount: birds.instanceCount,
        }}
      />
    </material>
  )
}

Birds.propTypes = {
  elapsed: PropTypes.number.isRequired,
  texPosition: PropTypes.object.isRequired,
  texVelocity: PropTypes.object.isRequired,
}

export default Birds
