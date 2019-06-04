import { useMemo } from 'react'
import {
  useWebGLContext,
  useProgram,
  useProgramUniforms,
} from '@react-vertex/core'
import vert from '../shaders/base.vert'
import frag from './gradient.subtract.frag'

export default function useVorticityProgram() {
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)
  const uniforms = useProgramUniforms(gl, program)

  const vorticity = useMemo(() => {
    return { program, uniforms }
  }, [program, uniforms])

  return vorticity
}
