import { useMemo } from 'react'
import {
  useWebGLContext,
  useProgram,
  useProgramUniforms,
} from '@react-vertex/core'
import vert from './vert'
import frag from './frag'

export default function useBirdsMaterial() {
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)
  const uniforms = useProgramUniforms(gl, program)

  const memoized = useMemo(
    () => ({ program, uniforms }),
    [program, uniforms],
  )

  return memoized
}
