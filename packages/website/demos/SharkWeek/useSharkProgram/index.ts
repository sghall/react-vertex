import { useWebGLContext, useProgram, useUniform1f } from '@react-vertex/core'
import vert from './vert.glsl'
import frag from './frag.glsl'

export function useSharkProgram(elapsed: number) {
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)

  useUniform1f(gl, program, 'elapsed', elapsed * 0.01)

  return program
}
