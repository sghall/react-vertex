import {
  useProgram,
  useTexture2d,
  useWebGLContext,
  useUniformSampler2d,
} from '@react-vertex/core'
import vert from './vert.glsl'
import frag from './frag.glsl'

export function useCubeProgram(textureUrl: string) {
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)

  const [texture] = useTexture2d(textureUrl)
  useUniformSampler2d(gl, program, 'texture', texture)

  return program
}
