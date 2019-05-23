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
import vert from './solid.vert'
import frag from './solid.frag'
import texVert from './textured.vert'
import texFrag from './textured.frag'
import attVert from './attenuated.vert'
import attFrag from './attenuated.frag'

const defaultKd = [1.0, 1.0, 1.0]
const defaultKs = [0.7, 0.7, 0.7]
const defaultNs = 200
const defaultKa = [1.0, 1.0, 1.0]
const defaultNa = 0

export function useSolidPhong(kd, na, ns, ka, ks) {
  const gl = useWebGLContext()
  const [vertShader, fragShader] = usePointLightCount(vert, frag)
  const program = useProgram(gl, vertShader, fragShader)

  usePointLightUniforms(gl, program)

  useUniform1f(gl, program, 'uNs', ns || defaultNs)
  useUniform1f(gl, program, 'uNa', na || defaultNa)

  useUniform3fv(gl, program, 'uKd', kd || defaultKd)
  useUniform3fv(gl, program, 'uKs', ks || defaultKs)
  useUniform3fv(gl, program, 'uKa', ka || defaultKa)

  return program
}

const uVScale = [1.0, 1.0]

export function useTexturedPhong(mapKd, na, ns, ka, ks) {
  const gl = useWebGLContext()
  const [vertShader, fragShader] = usePointLightCount(texVert, texFrag)
  const program = useProgram(gl, vertShader, fragShader)

  usePointLightUniforms(gl, program)

  useUniformSampler2d(gl, program, 'mapKd', mapKd)

  useUniform1f(gl, program, 'uNs', ns || defaultNs)
  useUniform1f(gl, program, 'uNa', na || defaultNa)

  useUniform2fv(gl, program, 'uVScale', uVScale)

  useUniform3fv(gl, program, 'uKs', ks || defaultKs)
  useUniform3fv(gl, program, 'uKa', ka || defaultKa)

  return program
}

export function useAttenuatedPhong(lightPosition, mapKd) {
  const gl = useWebGLContext()
  const program = useProgram(gl, attVert, attFrag)

  useUniform3fv(gl, program, 'uLightPosition', lightPosition)

  useUniformSampler2d(gl, program, 'texDiff', mapKd)

  return program
}
