import { useEffect } from 'react'
import { timer } from 'd3-timer'
import { useWebGLContext, useCanvasSize } from '@react-vertex/core'
import { SIM_RESOLUTION, DYE_RESOLUTION } from './config'
import usePointers from './usePointers'
import useSplatProgram from './useSplatProgram'
import useColorProgram from './useColorProgram'
import useBackgroundProgram from './useBackgroundProgram'
import useDisplayShadingProgram from './useDisplayShadingProgram'
import useResolution from './useResolution'
import useDoubleFBO from './useDoubleFBO'
import useFormats from './useFormats'

export default function useSimulation() {
  const { width, height } = useCanvasSize()

  const gl = useWebGLContext()
  const pointers = usePointers()

  const splat = useSplatProgram()
  const color = useColorProgram()
  const background = useBackgroundProgram()
  const displayShading = useDisplayShadingProgram()

  const simSize = useResolution(SIM_RESOLUTION, width, height)
  const dyeSize = useResolution(DYE_RESOLUTION, width, height)

  const { rg, rgb, halfFloat, hasLinear } = useFormats(gl)
  const filtering = hasLinear ? gl.LINEAR : gl.NEAREST

  const velocity = useDoubleFBO(gl, simSize, rg, halfFloat, filtering)
  const density = useDoubleFBO(gl, dyeSize, rgb, halfFloat, filtering)

  useEffect(() => {
    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(0)
  
      return (destination) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, destination)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
      }
    })()

    function render (target) {
      if (target == null) {
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
        gl.enable(gl.BLEND)
      } else {
        gl.disable(gl.BLEND)
      }
  
      const w = target == null ? width : dyeSize[0]
      const h = target == null ? height : dyeSize[1]
  
      gl.viewport(0, 0, w, h)
  
      gl.useProgram(color.program)
      gl.uniform4f(color.uniforms.color, 0, 0, 0, 1)
      blit(target)
  
      if (target == null) {
        gl.useProgram(background.program)
        blit(null)
      }
  
      gl.useProgram(displayShading.program)
      gl.uniform2f(displayShading.uniforms.texelSize, 1.0 / w, 1.0 / h)
      gl.uniform1i(displayShading.uniforms.uTexture, density.read.attach(0))
      blit(target)
    }

    function updateSplat(x, y, dx, dy, color) {
      gl.viewport(0, 0, ...simSize)

      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(splat.program)
      gl.uniform1i(splat.uniforms.uTarget, velocity.read.attach(0))
      gl.uniform2f(splat.uniforms.point, x / width, 1.0 - y / height)
      gl.uniform3f(splat.uniforms.color, dx, -dy, 1.0)
      blit(velocity.write.fbo)
      velocity.swap()

      gl.viewport(0, 0, ...dyeSize)
      gl.uniform1i(splat.uniforms.uTarget, density.read.attach(0))
      gl.uniform3f(splat.uniforms.color, color.r, color.g, color.b)
      blit(density.write.fbo)
      density.swap()
      console.log(dx, dy)
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
      render(null)
    })

    return () => timerLoop.stop()
  }, [gl, simSize, dyeSize, pointers, width, height, splat, color, background, displayShading, velocity, density])
}
