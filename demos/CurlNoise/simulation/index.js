import { useEffect } from 'react'
import { timer } from 'd3-timer'
import { useWebGLContext, useCanvasSize } from '@react-vertex/core'
import { SIM_RESOLUTION, DYE_RESOLUTION, CURL } from './config'
import usePointers from './usePointers'
import useSplatProgram from './useSplatProgram'
import useColorProgram from './useColorProgram'
import useBackgroundProgram from './useBackgroundProgram'
import useDisplayShadingProgram from './useDisplayShadingProgram'
import useCurlProgram from './useCurlProgram'
import useVorticityProgram from './useVorticityProgram'
import useDivergenceProgram from './useDivergenceProgram'
import useResolution from './useResolution'
import { useFBO, useDoubleFBO } from './useDoubleFBO'
import useFormats from './useFormats'

export default function useSimulation() {
  const { width, height } = useCanvasSize()

  const gl = useWebGLContext()
  const pointers = usePointers()

  const splat = useSplatProgram()
  const color = useColorProgram()
  const background = useBackgroundProgram()
  const displayShading = useDisplayShadingProgram()

  const curl = useCurlProgram()
  const vorticity = useVorticityProgram()
  const divergence = useDivergenceProgram()

  const simSize = useResolution(SIM_RESOLUTION, width, height)
  const dyeSize = useResolution(DYE_RESOLUTION, width, height)

  const { rgb, halfFloat, hasLinear } = useFormats(gl)
  const filtering = hasLinear ? gl.LINEAR : gl.NEAREST

  const velocity = useDoubleFBO(gl, simSize, rgb, halfFloat, filtering)
  const density = useDoubleFBO(gl, dyeSize, rgb, halfFloat, filtering)

  const curlFBO = useFBO(gl, simSize, rgb, halfFloat, gl.NEAREST)
  const divergenceFBO = useFBO(gl, simSize, rgb, halfFloat, gl.NEAREST)
  const pressure = useFBO(gl, simSize, rgb, halfFloat, gl.NEAREST)

  useEffect(() => {
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

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

    function step (dt) {
      gl.disable(gl.BLEND)
      gl.viewport(0, 0, ...simSize)
  
      gl.useProgram(curl.program)
      gl.uniform2f(curl.uniforms.texelSize, 1.0 / simSize[0], 1.0 / simSize[1])
      gl.uniform1i(curl.uniforms.uVelocity, velocity.read.attach(0))
      blit(curlFBO.fbo)
  
      gl.useProgram(vorticity.program)
      gl.uniform2f(vorticity.uniforms.texelSize, 1.0 / simSize[0], 1.0 / simSize[1])
      gl.uniform1i(vorticity.uniforms.uVelocity, velocity.read.attach(0))
      gl.uniform1i(vorticity.uniforms.uCurl, curlFBO.attach(1))
      gl.uniform1f(vorticity.uniforms.curl, CURL)
      gl.uniform1f(vorticity.uniforms.dt, dt)
      blit(velocity.write.fbo)
      velocity.swap()
  
      gl.useProgram(divergence.program)
      gl.uniform2f(divergence.uniforms.texelSize, 1.0 / simSize[0], 1.0 / simSize[1])
      gl.uniform1i(divergence.uniforms.uVelocity, velocity.read.attach(0))
      blit(divergenceFBO.fbo)
  
      // clearProgram.bind()
      // gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0))
      // gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE_DISSIPATION)
      // blit(pressure.write.fbo)
      // pressure.swap()
  
      // pressureProgram.bind()
      // gl.uniform2f(pressureProgram.uniforms.texelSize, 1.0 / simSize[0], 1.0 / simSize[1])
      // gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0))
      // for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
      //     gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1))
      //     blit(pressure.write.fbo)
      //     pressure.swap()
      // }
  
      // gradienSubtractProgram.bind()
      // gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, 1.0 / simSize[0], 1.0 / simSize[1])
      // gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read.attach(0))
      // gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1))
      // blit(velocity.write.fbo)
      // velocity.swap()
  
      // advectionProgram.bind()
      // gl.uniform2f(advectionProgram.uniforms.texelSize, 1.0 / simSize[0], 1.0 / simSize[1])
      // if (!ext.supportLinearFiltering)
      //     gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, 1.0 / simSize[0], 1.0 / simSize[1])
      // let velocityId = velocity.read.attach(0)
      // gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId)
      // gl.uniform1i(advectionProgram.uniforms.uSource, velocityId)
      // gl.uniform1f(advectionProgram.uniforms.dt, dt)
      // gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION)
      // blit(velocity.write.fbo)
      // velocity.swap()
  
      // gl.viewport(0, 0, ...dyeSize)
  
      // if (!ext.supportLinearFiltering)
      //     gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, 1.0 / dyeWidth, 1.0 / dyeHeight)
      // gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0))
      // gl.uniform1i(advectionProgram.uniforms.uSource, density.read.attach(1))
      // gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION)
      // blit(density.write.fbo)
      // density.swap()
    }


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

    function updateSplat(x, y, dx, dy, splatRGB) {
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
      gl.uniform3f(splat.uniforms.color, splatRGB.r, splatRGB.g, splatRGB.b)
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
      step(0.16)
      render(null)
    })

    return () => timerLoop.stop()
  }, [gl, simSize, dyeSize, pointers, width, height, splat, color, background, displayShading, velocity, density])
}
