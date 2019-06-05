import { useEffect, useMemo } from 'react'
import { timer } from 'd3-timer'
import {
  useWebGLContext,
  useProgram,
  useProgramUniforms,
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

export default function usePingPong(size) {
  const gl = useWebGLContext()
  const { floatType, hasLinear } = useFormats(gl)
  const getTexOpts = () => ({ type: floatType, minMag: hasLinear ? gl.LINEAR : gl.NEAREST })

  const posProgram = useProgram(gl, vert, positionFrag)
  const posUniforms = useProgramUniforms(gl, posProgram)

  const velProgram = useProgram(gl, vert, velocityFrag)
  const velUniforms = useProgramUniforms(gl, velProgram)

  const randomVelocityData = useRandomVelocityData(size)
  const randomPositionData = useRandomPositionData(size)

  const posInitial = useDataTexture(gl, randomPositionData, size, size)
  const velInitial = useDataTexture(gl, randomVelocityData, size, size)

  const velocityDFBO = useDoubleFBO(gl, size, size, getTexOpts)
  const positionDFBO = useDoubleFBO(gl, size, size, getTexOpts)

  const scene = useSceneNode()


  useEffect(() => {
    const texUnit1 = scene.getTextureUnit()
    const texUnit2 = scene.getTextureUnit()

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

      return buffer => {
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW)
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(0)

        gl.bindFramebuffer(gl.FRAMEBUFFER, buffer)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      }
    })()

    const timerLoop = timer(e => {
      const elapsed = e * 0.001
      const delta = elapsed - prevElapsed
      prevElapsed = elapsed

      gl.viewport(0, 0, size, size)
      
      // **********************************************
      // POSTION
      // **********************************************
      gl.useProgram(posProgram)

      gl.uniform2f(posUniforms.resolution, size, size)
      gl.uniform1f(posUniforms.delta, delta * 0.5)
      gl.uniform1f(posUniforms.elapsed, elapsed)

      if (isInitialRender) {
        gl.activeTexture(gl.TEXTURE0 + texUnit2)
        gl.bindTexture(gl.TEXTURE_2D, velInitial)
        gl.uniform1i(posUniforms.texVelocity, texUnit2)

        gl.activeTexture(gl.TEXTURE0 + texUnit1)
        gl.bindTexture(gl.TEXTURE_2D, posInitial)
        gl.uniform1i(posUniforms.texPosition, texUnit1)
      } else {
        positionDFBO.read.attach(texUnit1)
        velocityDFBO.read.attach(texUnit2)
        gl.uniform1i(posUniforms.texPosition, texUnit1)
        gl.uniform1i(posUniforms.texVelocity, texUnit2)
      }

      renderToBuffer(positionDFBO.write.fbo)
      positionDFBO.swap()

      // **********************************************
      // VELOCITY
      // **********************************************
      gl.useProgram(velProgram)

      gl.uniform2f(velUniforms.resolution, size, size)
      gl.uniform1f(velUniforms.delta, delta * 0.5)
      gl.uniform1f(velUniforms.elapsed, elapsed)

      if (isInitialRender) {
        gl.activeTexture(gl.TEXTURE0 + texUnit2)
        gl.bindTexture(gl.TEXTURE_2D, posInitial)
        gl.uniform1i(velUniforms.texPosition, texUnit2)

        gl.activeTexture(gl.TEXTURE0 + texUnit1)
        gl.bindTexture(gl.TEXTURE_2D, velInitial)
        gl.uniform1i(velUniforms.texVelocity, texUnit1)

        isInitialRender = false
      } else {
        velocityDFBO.read.attach(texUnit1)
        positionDFBO.read.attach(texUnit2)
        gl.uniform1i(velUniforms.texVelocity, texUnit1)
        gl.uniform1i(velUniforms.texPosition, texUnit2)
      }

      renderToBuffer(velocityDFBO.write.fbo)
      velocityDFBO.swap()
    })

    return () => {
      timerLoop.stop()
      scene.releaseTextureUnit(texUnit1)
      scene.releaseTextureUnit(texUnit2)
    }
  }, [
    gl,
    scene,
    size,
    positionDFBO,
    posInitial,
    posProgram,
    posUniforms,
    velocityDFBO,
    velInitial,
    velProgram,
    velUniforms,
  ])

  return [positionDFBO, velocityDFBO]
}
