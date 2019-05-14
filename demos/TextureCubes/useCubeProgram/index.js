import {
  useProgram,
  useTexture2d,
  useWebGLContext,
  useUniformSampler2d,
} from '@react-vertex/core'
import vert from './vert.glsl'
import frag from './frag.glsl'

export default function CubeMaterial(textureUnit, textureUrl) {
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)

  const [texture] = useTexture2d(gl, textureUrl)
  useUniformSampler2d(gl, program, 'texture', texture, textureUnit)

  return program
}
