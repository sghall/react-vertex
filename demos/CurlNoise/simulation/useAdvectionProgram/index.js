import { useMemo } from 'react'
import {
  useWebGLContext,
  useProgram,
  useProgramUniforms,
} from '@react-vertex/core'
import vert from '../shaders/base.vert'
import frag1 from './advection.frag'
import frag2 from './advection.manual.frag'

export default function useVorticityProgram(hasLinear) {
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, hasLinear ? frag1 : frag2)
  const uniforms = useProgramUniforms(gl, program)

  const vorticity = useMemo(() => {
    return { program, uniforms }
  }, [program, uniforms])

  return vorticity
}
