import {
  useProgram,
  useUniform1f,
  useUniform3fv,
  useWebGLContext,
  usePointLightCount,
  usePointLightUniforms,
} from '@react-vertex/core'
import vert from './vert'
import frag from './frag'

export function useSolidLambert(kd, na, ka) {
  const gl = useWebGLContext()
  const [vertShader, fragShader] = usePointLightCount(vert, frag)
  const program = useProgram(gl, vertShader, fragShader)

  usePointLightUniforms(gl, program)

  useUniform3fv(gl, program, 'uKd', kd)
  useUniform3fv(gl, program, 'uKa', ka)
  useUniform1f(gl, program, 'uNa', na)

  return program
}
