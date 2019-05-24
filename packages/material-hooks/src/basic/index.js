import {
  useProgram,
  useUniform2fv,
  useUniform3fv,
  useWebGLContext,
  useUniformSampler2d,
  usePointLightUniforms,
} from '@react-vertex/core'
import solidVert from './solid.vert'
import solidFrag from './solid.frag'
import texturedVert from './textured.vert'
import texturedFrag from './textured.frag'

const defaultKd = [1, 1, 1]

export function useBasicSolid(kd = defaultKd) {
  const gl = useWebGLContext()
  const program = useProgram(gl, solidVert, solidFrag)

  useUniform3fv(gl, program, 'uKd', kd)

  return program
}

const uVScale = [1.0, 1.0]

export function useBasicTextured(mapKd) {
  const gl = useWebGLContext()
  const program = useProgram(gl, texturedVert, texturedFrag)

  usePointLightUniforms(gl, program)
  useUniformSampler2d(gl, program, 'mapKd', mapKd)
  useUniform2fv(gl, program, 'uVScale', uVScale)

  return program
}
