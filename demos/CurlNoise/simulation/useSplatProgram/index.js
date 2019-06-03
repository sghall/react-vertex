import { useMemo } from 'react'
import {
  useWebGLContext,
  useProgram,
  useProgramUniforms,
} from '@react-vertex/core'
import vert from '../shaders/base.vert'
import frag from './splat.frag'

export default function useSplatProgram() {
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)
  const uniforms = useProgramUniforms(gl, program)

  const splat = useMemo(() => {
    return { program, uniforms }
  }, [program, uniforms])

  return splat
}
