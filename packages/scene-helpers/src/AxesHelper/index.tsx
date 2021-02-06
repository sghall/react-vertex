import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  useProgram,
  useStaticBuffer,
  useAttribute,
  useWebGLContext,
} from '@react-vertex/core'
import vert from './vert'
import frag from './frag'

export function useAxesHelperProgram() {
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)

  return program
}

// prettier-ignore
const colors = [
  1.0, 0.0, 0.0, 1.0, 0.5, 0.0,
  0.0, 1.0, 0.0, 0.5, 1.0, 0.0,
  0.0, 0.0, 1.0, 0.0, 0.5, 1.0,
]

export function useAxesHelperGeometry(size: number) {
  const geometry = useMemo(() => {
    // prettier-ignore
    const positions = [
      0, 0, 0, size, 0, 0,
      0, 0, 0, 0, size, 0,
      0, 0, 0, 0, 0, size,
    ]

    return { colors, positions }
  }, [size])

  return geometry
}

const indices = [0, 1, 2, 3, 4, 5]

export function useAxesHelperElements(size: number) {
  const gl = useWebGLContext()
  const { positions, colors } = useAxesHelperGeometry(size)

  const positionBuffer = useStaticBuffer(gl, positions, false, 'F32')
  const position = useAttribute(gl, 3, positionBuffer)

  const colorBuffer = useStaticBuffer(gl, colors, false, 'F32')
  const color = useAttribute(gl, 3, colorBuffer)

  const indexBuffer = useStaticBuffer(gl, indices, true, 'U16')

  const elements = useMemo(
    () => ({
      index: indexBuffer,
      count: indices.length,
      attributes: { position, color },
      drawElements: { mode: 'LINES', count: indices.length },
    }),
    [indexBuffer, position, color],
  )

  return elements
}

export function AxesHelper({ size }: { size: number }) {
  const axesProgram = useAxesHelperProgram()
  const axesElements = useAxesHelperElements(size)

  return (
    <material program={axesProgram}>
      <geometry {...axesElements} />
    </material>
  )
}

AxesHelper.propTypes = {
  size: PropTypes.number,
}

AxesHelper.defaultProps = {
  size: 100,
}
