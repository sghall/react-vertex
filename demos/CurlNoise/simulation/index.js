import { useEffect } from 'react'
import { timer } from 'd3-timer'
import { useWebGLContext, useCanvasSize } from '@react-vertex/core'
// import config from './config'
import usePointers from './usePointers'
import useSplatProgram from './useSplatProgram'

export default function useSimulation() {
  const { width, height } = useCanvasSize()

  const gl = useWebGLContext()
  const pointers = usePointers()

  const splat = useSplatProgram()

  useEffect(() => {
    function updateSplat(x, y, dx, dy, color) {
      // gl.viewport(0, 0, simWidth, simHeight)

      gl.useProgram(splat.program)
      // gl.uniform1i(splat.uniforms.uTarget, velocity.read.attach(0))
      gl.uniform2f(splat.uniforms.point, x / width, 1.0 - y / height)
      gl.uniform3f(splat.uniforms.color, dx, -dy, 1.0)
      // blit(velocity.write.fbo)
      // velocity.swap()

      // gl.viewport(0, 0, dyeWidth, dyeHeight)
      // gl.uniform1i(splat.uniforms.uTarget, density.read.attach(0))
      gl.uniform3f(splat.uniforms.color, color.r, color.g, color.b)
      // blit(density.write.fbo)
      // density.swap()
    }

    function input() {
      for (let i = 0; i < pointers.length; i++) {
        const p = pointers[i]

        if (p.moved) {
          updateSplat(p.x, p.y, p.dx, p.dy, p.color)
          p.moved = false
        }
      }
    }

    const timerLoop = timer(() => {
      input()
    })

    return () => timerLoop.stop()
  }, [gl, pointers, width, height, splat])
}
