import { useMemo } from 'react'
import {
  useWebGLContext,
  useCanvasSize,
  useProgram,
  useProgramUniforms,
  useUniform1f,
} from '@react-vertex/core'
import vert from '../shaders/base.vert'
import frag from './background.frag'

export default function useSplatProgram() {
  const { width, height } = useCanvasSize()

  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)
  const uniforms = useProgramUniforms(gl, program)

  useUniform1f(gl, program, 'aspectRatio', width / height)

  const background = useMemo(() => {
    return { program, uniforms }
  }, [program, uniforms])

  return background
}
