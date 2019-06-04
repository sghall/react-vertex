import { useMemo } from 'react'
import {
  useWebGLContext,
  useProgram,
  useProgramUniforms,
} from '@react-vertex/core'
import vert from '../shaders/base.vert'
import frag from './display.shading.frag'

export default function useDisplayShadingProgram() {
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)
  const uniforms = useProgramUniforms(gl, program)

  const displayShading = useMemo(() => {
    return { program, uniforms }
  }, [program, uniforms])

  return displayShading
}
