import { useMemo } from 'react'
import {
  useWebGLContext,
  useProgram,
  useProgramUniforms,
} from '@react-vertex/core'
import vert from './vert.glsl'
import frag from './frag.glsl'

export default function useParticleMaterial() {
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)
  const uniforms = useProgramUniforms(gl, program)

  const memoized = useMemo(() => ({ program, uniforms }), [program, uniforms])

  return memoized
}
