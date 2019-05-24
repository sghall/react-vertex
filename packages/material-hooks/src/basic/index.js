import { useProgram, useWebGLContext, useUniform3fv } from '@react-vertex/core'
import vert from './vert'
import frag from './frag'

const defaultKd = [1, 1, 1]

export function useBasicSolid(kd = defaultKd) {
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)

  useUniform3fv(gl, program, 'uKd', kd)

  return program
}
