import {
  useProgram,
  useUniform1f,
  useUniform2fv,
  useUniform3fv,
  useWebGLContext,
  useUniformSampler2d,
  usePointLightCount,
  usePointLightUniforms,
} from '@react-vertex/core'
import solidVert from './solid.vert'
import solidFrag from './solid.frag'
import texturedVert from './textured.vert'
import texturedFrag from './textured.frag'

const defaultKd = [1.0, 1.0, 1.0]
const defaultKa = [1.0, 1.0, 1.0]
const defaultNa = 0

export function useLambertSolid(kd, na, ka) {
  const gl = useWebGLContext()
  const [vert, frag] = usePointLightCount(solidVert, solidFrag)
  const program = useProgram(gl, vert, frag)

  usePointLightUniforms(gl, program)

  useUniform1f(gl, program, 'uNa', na || defaultNa)
  useUniform3fv(gl, program, 'uKa', ka || defaultKa)

  useUniform3fv(gl, program, 'uKd', kd || defaultKd)

  return program
}

const uVScale = [1.0, 1.0]

export function useLambertTextured(mapKd, na, ka) {
  const gl = useWebGLContext()
  const [vert, frag] = usePointLightCount(texturedVert, texturedFrag)
  const program = useProgram(gl, vert, frag)

  usePointLightUniforms(gl, program)

  useUniformSampler2d(gl, program, 'mapKd', mapKd)

  useUniform2fv(gl, program, 'uVScale', uVScale)

  useUniform1f(gl, program, 'uNa', na || defaultNa)
  useUniform3fv(gl, program, 'uKa', ka || defaultKa)

  return program
}
