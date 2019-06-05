import { useEffect, useMemo } from 'react'
import { timer } from 'd3-timer'
import {
  useWebGLContext,
  useProgram,
  useFrameBuffer,
  useDataTexture,
  useSceneNode,
} from '@react-vertex/core'
import vert from './vert'
import positionFrag from './position.frag'
import velocityFrag from './velocity.frag'
import { useRandomPositionData, useRandomVelocityData } from './dataHooks'

function useFBO(gl, width, height, getTexOpts) {
  const tex = useDataTexture(gl, null, width, height, getTexOpts)
  const fbo = useFrameBuffer(gl)

  const memoized = useMemo(() => {
    const attach = gl.COLOR_ATTACHMENT0
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attach, gl.TEXTURE_2D, tex, 0)

    return {
      tex,
      fbo,
      attach(unit) {
        gl.activeTexture(gl.TEXTURE0 + unit)
        gl.bindTexture(gl.TEXTURE_2D, tex)
        return unit
      },
    }
  }, [gl, fbo, tex])

  return memoized
}

function useDoubleFBO(gl, width, height, getTexOpts) {
  const frameBuffer1 = useFBO(gl, width, height, getTexOpts)
  const frameBuffer2 = useFBO(gl, width, height, getTexOpts)

  const memoized = useMemo(() => {
    let fbo1 = frameBuffer1
    let fbo2 = frameBuffer2

    return {
      get read() {
        return fbo1
      },
      set read(value) {
        fbo1 = value
      },
      get write() {
        return fbo2
      },
      set write(value) {
        fbo2 = value
      },
      swap() {
        const temp = fbo1
        fbo1 = fbo2
        fbo2 = temp
      },
    }
  }, [frameBuffer1, frameBuffer2])

  return memoized
}

function useFormats(gl) {
  const memoized = useMemo(() => {
    const halfFloat = gl.getExtension('OES_texture_half_float')
    const hasLinear = !!gl.getExtension('OES_texture_half_float_linear')

    const floatType = halfFloat ? halfFloat.HALF_FLOAT_OES : gl.FLOAT
  
    return { floatType, hasLinear }
  }, [gl])

  return memoized
}

export function usePingPong(program, size, name, initialTexture) {
  const gl = useWebGLContext()

  const scene = useSceneNode()

  const { floatType, hasLinear } = useFormats(gl)
  const getTexOpts = () => ({ type: floatType, minMag: hasLinear ? gl.LINEAR : gl.NEAREST })

  const pingPong = useDoubleFBO(gl, size, size, getTexOpts)

  useEffect(() => {
    const texUnit = scene.getTextureUnit()

    const tLocation = gl.getUniformLocation(program, name)
    const eLocation = gl.getUniformLocation(program, 'elapsed')
    const dLocation = gl.getUniformLocation(program, 'delta')
    const rLocation = gl.getUniformLocation(program, 'resolution')

    let prevElapsed = 0
    let isInitialRender = true

    // prettier-ignore
    const renderToBuffer = (() => {
      const verts = new Float32Array([
        -1.0, +1.0, +0.0, 
        -1.0, -1.0, +0.0, 
        +1.0, -1.0, +0.0, 
        +1.0, +1.0, +0.0,
      ])

      const index = new Uint16Array([0, 1, 2, 0, 2, 3])

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW)
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(0)

      return buffer => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, buffer)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      }
    })()

    const timerLoop = timer(e => {
      const elapsed = e * 0.001
      const delta = elapsed - prevElapsed
      prevElapsed = elapsed

      gl.useProgram(program)
      gl.viewport(0, 0, size, size)

      gl.uniform2f(rLocation, size, size)
      gl.uniform1f(dLocation, delta * 0.5)
      gl.uniform1f(eLocation, elapsed)

      if (isInitialRender) {
        gl.activeTexture(gl.TEXTURE0 + texUnit)
        gl.bindTexture(gl.TEXTURE_2D, initialTexture)
        gl.uniform1i(tLocation, texUnit)

        isInitialRender = false
      } else {
        gl.uniform1i(tLocation, pingPong.read.attach(texUnit))
      }

      gl.uniform2f(rLocation, size, size)
      gl.uniform1f(dLocation, delta * 0.5)
      gl.uniform1f(eLocation, elapsed)

      renderToBuffer(pingPong.write.fbo)

      pingPong.swap()
    })

    return () => {
      timerLoop.stop()
      scene.releaseTextureUnit(texUnit)
    }
  }, [
    gl,
    scene,
    name,
    size,
    program,
    pingPong,
    initialTexture
  ])

  return pingPong
}

export function useDataTextures(size) {
  const gl = useWebGLContext()
  // const scene = useSceneNode()

  const velProgram = useProgram(gl, vert, velocityFrag)
  const posProgram = useProgram(gl, vert, positionFrag)

  // const deps = useMemo(() => {
  //   const velUnit = scene.getTextureUnit()
  //   const velLocation = gl.getUniformLocation(posProgram, 'texVelocity')

  //   const posUnit = scene.getTextureUnit()
  //   const posLocation = gl.getUniformLocation(velProgram, 'texPosition')

  //   return { velUnit, velLocation, posUnit, posLocation }
  // }, [gl, scene, posProgram, velProgram])

  const randomVelocityData = useRandomVelocityData(size)
  const randomPositionData = useRandomPositionData(size)

  const posInitial = useDataTexture(gl, randomPositionData, size, size)
  const velInitial = useDataTexture(gl, randomVelocityData, size, size)

  const velocityDFBO = usePingPong(velProgram, size, 'texVelocity', velInitial)
  const positionDFBO = usePingPong(posProgram, size, 'texPosition', posInitial)

  // gl.useProgram(posProgram)
  // gl.activeTexture(gl[`TEXTURE${deps.velUnit}`])
  // gl.bindTexture(gl.TEXTURE_2D, texVelocity)
  // gl.uniform1i(deps.velLocation, deps.velUnit)

  // gl.useProgram(velProgram)
  // gl.activeTexture(gl[`TEXTURE${deps.posUnit}`])
  // gl.bindTexture(gl.TEXTURE_2D, texPosition)
  // gl.uniform1i(deps.posLocation, deps.posUnit)

  return [velocityDFBO, positionDFBO]
}
