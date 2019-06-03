import { useMemo } from 'react'
import {
  useWebGLContext,
  useProgram,
  useProgramUniforms,
} from '@react-vertex/core'
import vert from '../shaders/base.vert'
import frag from './divergence.frag'

export default function useDivergenceProgram() {
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)
  const uniforms = useProgramUniforms(gl, program)

  const divergence = useMemo(() => {
    return { program, uniforms }
  }, [program, uniforms])

  return divergence
}
