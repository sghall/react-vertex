import {
  useProgram,
  useUniform2fv,
  useUniform3fv,
  useWebGLContext,
  useUniformSampler2d,
  usePointLightCount,
  usePointLightUniforms,
} from '@react-vertex/core'
import vert from './vert'
import frag from './frag'
import texVert from './textured.vert'
import texFrag from './textured.frag'

const defaultKd = [1, 1, 1]

export function useBasicSolid(kd = defaultKd) {
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)

  useUniform3fv(gl, program, 'uKd', kd)

  return program
}

const uVScale = [1.0, 1.0]

export function useBasicTextured(mapKd) {
  const gl = useWebGLContext()
  const [vertShader, fragShader] = usePointLightCount(texVert, texFrag)
  const program = useProgram(gl, vertShader, fragShader)

  usePointLightUniforms(gl, program)

  useUniformSampler2d(gl, program, 'mapKd', mapKd)

  useUniform2fv(gl, program, 'uVScale', uVScale)

  return program
}
