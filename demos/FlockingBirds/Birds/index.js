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
import vert from './vert'
import frag from './frag'
import { useBirdGeometry } from './geometry'

function Birds({ size, elapsed, posUnit, texPosition, velUnit, texVelocity }) {
  const birds = useBirdGeometry(size)

  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)

  useUniform1f(gl, program, 'elapsed', elapsed)

  const posLocation = gl.getUniformLocation(program, 'texPosition')
  const velLocation = gl.getUniformLocation(program, 'texVelocity')

  gl.useProgram(program)

  gl.activeTexture(gl[`TEXTURE${posUnit}`])
  gl.bindTexture(gl.TEXTURE_2D, texPosition)
  gl.uniform1i(posLocation, posUnit)

  gl.activeTexture(gl[`TEXTURE${velUnit}`])
  gl.bindTexture(gl.TEXTURE_2D, texVelocity)
  gl.uniform1i(velLocation, velUnit)

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
  size: PropTypes.number.isRequired,
  elapsed: PropTypes.number.isRequired,
  posUnit: PropTypes.number.isRequired,
  texPosition: PropTypes.object.isRequired,
  velUnit: PropTypes.number.isRequired,
  texVelocity: PropTypes.object.isRequired,
}

export default Birds
