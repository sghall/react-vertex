import { useMemo } from 'react'
import {
  useProgram,
  useProgramUniforms,
} from '@react-vertex/core'
import * as shaders from './shaders'

function useProgramAndUniforms(gl, frag) {
  const program = useProgram(gl, shaders.vert, frag)
  const uniforms = useProgramUniforms(gl, program)

  const memoized = useMemo(() => {
    return { program, uniforms }
  }, [program, uniforms])

  return memoized
}

export default function usePrograms(gl, hasLinear) {
  const background = useProgramAndUniforms(gl, shaders.background)
  const clear = useProgramAndUniforms(gl, shaders.clear)
  const color = useProgramAndUniforms(gl, shaders.color)
  const curl = useProgramAndUniforms(gl, shaders.curl)
  const displayShading = useProgramAndUniforms(gl, shaders.displayShading)
  const divergence = useProgramAndUniforms(gl, shaders.divergence)
  const gradient = useProgramAndUniforms(gl, shaders.gradient)
  const pressure = useProgramAndUniforms(gl, shaders.pressure)
  const splat = useProgramAndUniforms(gl, shaders.splat)
  const vorticityFrag = hasLinear ? shaders.advection : shaders.advectionManual
  const vorticity = useProgramAndUniforms(gl, vorticityFrag)

  const programs = useMemo(() => {
    return { background, clear, color, curl, displayShading, divergence, gradient, pressure, splat, vorticity }
  }, [background, clear, color, curl, displayShading, divergence, gradient, pressure, splat, vorticity])

  return programs
}
