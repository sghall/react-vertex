import React, { memo } from 'react'
import PropTypes from 'prop-types'
import {
  useProgram,
  useTexture2d,
  useWebGLContext,
  useUniformSampler2d,
} from '@react-vertex/core'
import vert from './vert.glsl'
import frag from './frag.glsl'

function CubeMaterial({ textureUnit, textureUrl, children }) {
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)

  const [texture] = useTexture2d(gl, textureUrl)
  useUniformSampler2d(gl, program, 'texture', texture, textureUnit)

  return <material program={program}>{children}</material>
}

CubeMaterial.propTypes = {
  children: PropTypes.node.isRequired,
  textureUrl: PropTypes.string.isRequired,
  textureUnit: PropTypes.number.isRequired,
}

export default memo(CubeMaterial)
