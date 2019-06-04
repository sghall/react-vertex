import { useEffect } from 'react'
import { timer } from 'd3-timer'
import { convertHex } from '@react-vertex/color-hooks'
import { useWebGLContext, useCanvasSize } from '@react-vertex/core'
import {
  TRANSPARENT,
  SIM_RESOLUTION,
  DYE_RESOLUTION,
  SPLAT_RADIUS,
  CURL,
  PRESSURE_DISSIPATION,
  PRESSURE_ITERATIONS,
  VELOCITY_DISSIPATION,
  DENSITY_DISSIPATION,
} from './config'
import { generateColor } from './utils'
import {
  usePointers,
  usePrograms,
  useFrameBuffers,
  useFormats,
  useResolution,
} from './customHooks'

const backColor = convertHex('#323334')

function Scene() {
  const { width, height } = useCanvasSize()

  const gl = useWebGLContext()
  const { halfFloat, hasLinear } = useFormats(gl)
  const minMag = hasLinear ? gl.LINEAR : gl.NEAREST

  const pointers = usePointers()
  const programs = usePrograms(gl, hasLinear)

  const simSize = useResolution(SIM_RESOLUTION, width, height)
  const dyeSize = useResolution(DYE_RESOLUTION, width, height)

  const frameBuffers = useFrameBuffers(gl, dyeSize, simSize, halfFloat, minMag)

  useEffect(() => {
    if (!width || !height) {
      return
    }

    const {
      advection,
      background,
      clear,
      color,
      curl,
      displayShading,
      divergence,
      gradient,
      pressure,
      splat,
      vorticity,
    } = programs

    const {
      curlFBO,
      divergenceFBO,
      densityDFBO,
      pressureDFBO,
      velocityDFBO,
    } = frameBuffers

    const splatStack = []

    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        gl.STATIC_DRAW,
      )
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]),
        gl.STATIC_DRAW,
      )
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(0)

      return destination => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, destination)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
      }
    })()

    function input() {
      if (splatStack.length > 0) {
        multipleSplats(splatStack.pop())
      }

      for (let i = 0; i < pointers.length; i++) {
        const p = pointers[i]
        if (p.moved) {
          updateSplat(p.x, p.y, p.dx, p.dy, p.color)
          p.moved = false
        }
      }
    }

    function step(dt) {
      gl.disable(gl.BLEND)
      gl.viewport(0, 0, simSize[0], simSize[1])

      gl.useProgram(curl.program)
      gl.uniform2f(curl.uniforms.texelSize, 1.0 / simSize[0], 1.0 / simSize[1])
      gl.uniform1i(curl.uniforms.uVelocity, velocityDFBO.read.attach(0))
      blit(curlFBO.fbo)

      gl.useProgram(vorticity.program)
      gl.uniform2f(
        vorticity.uniforms.texelSize,
        1.0 / simSize[0],
        1.0 / simSize[1],
      )
      gl.uniform1i(vorticity.uniforms.uVelocity, velocityDFBO.read.attach(0))
      gl.uniform1i(vorticity.uniforms.uCurl, curlFBO.attach(1))
      gl.uniform1f(vorticity.uniforms.curl, CURL)
      gl.uniform1f(vorticity.uniforms.dt, dt)
      blit(velocityDFBO.write.fbo)
      velocityDFBO.swap()

      gl.useProgram(divergence.program)
      gl.uniform2f(
        divergence.uniforms.texelSize,
        1.0 / simSize[0],
        1.0 / simSize[1],
      )
      gl.uniform1i(divergence.uniforms.uVelocity, velocityDFBO.read.attach(0))
      blit(divergenceFBO.fbo)

      gl.useProgram(clear.program)
      gl.uniform1i(clear.uniforms.uTexture, pressureDFBO.read.attach(0))
      gl.uniform1f(clear.uniforms.value, PRESSURE_DISSIPATION)
      blit(pressureDFBO.write.fbo)
      pressureDFBO.swap()

      gl.useProgram(pressure.program)
      gl.uniform2f(
        pressure.uniforms.texelSize,
        1.0 / simSize[0],
        1.0 / simSize[1],
      )
      gl.uniform1i(pressure.uniforms.uDivergence, divergenceFBO.attach(0))

      for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressure.uniforms.uPressure, pressureDFBO.read.attach(1))
        blit(pressureDFBO.write.fbo)
        pressureDFBO.swap()
      }

      gl.useProgram(gradient.program)
      gl.uniform2f(
        gradient.uniforms.texelSize,
        1.0 / simSize[0],
        1.0 / simSize[1],
      )
      gl.uniform1i(gradient.uniforms.uPressure, pressureDFBO.read.attach(0))
      gl.uniform1i(gradient.uniforms.uVelocity, velocityDFBO.read.attach(1))
      blit(velocityDFBO.write.fbo)
      velocityDFBO.swap()

      gl.useProgram(advection.program)
      gl.uniform2f(
        advection.uniforms.texelSize,
        1.0 / simSize[0],
        1.0 / simSize[1],
      )

      if (!hasLinear) {
        gl.uniform2f(
          advection.uniforms.dyeTexelSize,
          1.0 / simSize[0],
          1.0 / simSize[1],
        )
      }

      let velocityId = velocityDFBO.read.attach(0)
      gl.uniform1i(advection.uniforms.uVelocity, velocityId)
      gl.uniform1i(advection.uniforms.uSource, velocityId)
      gl.uniform1f(advection.uniforms.dt, dt)
      gl.uniform1f(advection.uniforms.dissipation, VELOCITY_DISSIPATION)
      blit(velocityDFBO.write.fbo)
      velocityDFBO.swap()

      gl.viewport(0, 0, dyeSize[0], dyeSize[1])

      if (!hasLinear) {
        gl.uniform2f(
          advection.uniforms.dyeTexelSize,
          1.0 / dyeSize[0],
          1.0 / dyeSize[1],
        )
      }

      gl.uniform1i(advection.uniforms.uVelocity, velocityDFBO.read.attach(0))
      gl.uniform1i(advection.uniforms.uSource, densityDFBO.read.attach(1))
      gl.uniform1f(advection.uniforms.dissipation, DENSITY_DISSIPATION)
      blit(densityDFBO.write.fbo)
      densityDFBO.swap()
    }

    function render(target) {
      if (target == null || !TRANSPARENT) {
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
        gl.enable(gl.BLEND)
      } else {
        gl.disable(gl.BLEND)
      }

      const width = target == null ? gl.drawingBufferWidth : dyeSize[0]
      const height = target == null ? gl.drawingBufferHeight : dyeSize[1]

      gl.viewport(0, 0, width, height)

      if (!TRANSPARENT) {
        gl.useProgram(color.program)
        gl.uniform4f(color.uniforms.color, ...backColor)
        blit(target)
      }

      if (target == null && TRANSPARENT) {
        gl.useProgram(background.program)
        gl.uniform1f(background.uniforms.aspectRatio, width / height)
        blit(null)
      }

      gl.useProgram(displayShading.program)
      gl.uniform2f(displayShading.uniforms.texelSize, 1.0 / width, 1.0 / height)
      gl.uniform1i(displayShading.uniforms.uTexture, densityDFBO.read.attach(0))

      blit(target)
    }

    function updateSplat(x, y, dx, dy, splatRGB) {
      gl.viewport(0, 0, simSize[0], simSize[1])

      gl.useProgram(splat.program)
      gl.uniform1i(splat.uniforms.uTarget, velocityDFBO.read.attach(0))
      gl.uniform1f(splat.uniforms.aspectRatio, width / height)
      gl.uniform2f(splat.uniforms.point, x / width, 1.0 - y / height)
      gl.uniform3f(splat.uniforms.color, dx, -dy, 1.0)
      gl.uniform1f(splat.uniforms.radius, SPLAT_RADIUS / 100.0)
      blit(velocityDFBO.write.fbo)
      velocityDFBO.swap()

      gl.viewport(0, 0, dyeSize[0], dyeSize[1])
      gl.uniform1i(splat.uniforms.uTarget, densityDFBO.read.attach(0))
      gl.uniform3f(splat.uniforms.color, splatRGB.r, splatRGB.g, splatRGB.b)
      blit(densityDFBO.write.fbo)
      densityDFBO.swap()
    }

    function multipleSplats(amount) {
      for (let i = 0; i < amount; i++) {
        const splatRGB = generateColor()
        splatRGB.r *= 10.0
        splatRGB.g *= 10.0
        splatRGB.b *= 10.0
        const x = width * Math.random()
        const y = height * Math.random()
        const dx = 1000 * (Math.random() - 0.5)
        const dy = 1000 * (Math.random() - 0.5)
        updateSplat(x, y, dx, dy, splatRGB)
      }
    }

    const timerLoop = timer(() => {
      input()
      step(0.016)
      render(null)
    })

    multipleSplats(parseInt(Math.random() * 20) + 5)

    return () => timerLoop.stop()
  }, [
    gl,
    hasLinear,
    pointers,
    simSize,
    dyeSize,
    width,
    height,
    programs,
    frameBuffers,
  ])

  return null
}

Scene.propTypes = {}

export default Scene
