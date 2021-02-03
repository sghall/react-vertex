import { useMemo } from 'react'
import {
  useWebGLContext,
  useProgram,
  useWebGLVersion,
  useTextureUnit,
  useProgramUniforms,
  useDataTexture,
  useDoubleFBO,
} from '@react-vertex/core'
import vert from './vert'
import positionFrag from './position.frag'
import velocityFrag from './velocity.frag'
import { useRandomPositionData, useRandomVelocityData } from './dataHooks'

function supportRenderTextureFormat(gl, internalFormat, format, type) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null)

  const fbo = gl.createFramebuffer()
  const attach = gl.COLOR_ATTACHMENT0

  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, attach, gl.TEXTURE_2D, texture, 0)

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)

  if (status != gl.FRAMEBUFFER_COMPLETE) {
    return false
  }

  return true
}

function getSupportedFormat(gl, internalFormat, format, type) {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    switch (internalFormat) {
      case gl.R16F:
        return getSupportedFormat(gl, gl.RG16F, gl.RG, type)
      case gl.RG16F:
        return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type)
      default:
        return null
    }
  }

  return { internalFormat, format }
}

function useFormats(gl) {
  const version = useWebGLVersion()

  const memoized = useMemo(() => {
    let halfFloatExt
    let hasLinear

    if (version === 2) {
      gl.getExtension('EXT_color_buffer_float')
      hasLinear = !!gl.getExtension('OES_texture_float_linear')
    } else {
      halfFloatExt = gl.getExtension('OES_texture_half_float')
      hasLinear = !!gl.getExtension('OES_texture_half_float_linear')
    }

    const halfFloat =
      version === 2 ? gl.HALF_FLOAT : halfFloatExt.HALF_FLOAT_OES

    let RGBA

    if (version === 2) {
      RGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloat)
    } else {
      RGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloat)
    }

    return {
      RGBA,
      halfFloat,
      hasLinear,
    }
  }, [gl, version])

  return memoized
}

export default function useCompute(size) {
  const gl = useWebGLContext()
  const { halfFloat, RGBA } = useFormats(gl)

  const texUnit1 = useTextureUnit()
  const texUnit2 = useTextureUnit()

  const posProgram = useProgram(gl, vert, positionFrag)
  const posUniforms = useProgramUniforms(gl, posProgram)

  const velProgram = useProgram(gl, vert, velocityFrag)
  const velUniforms = useProgramUniforms(gl, velProgram)

  const randomVelocityData = useRandomVelocityData(size)
  const randomPositionData = useRandomPositionData(size)

  const posInitial = useDataTexture(gl, randomPositionData, size, size, () => {
    return { minMag: gl.NEAREST, ...RGBA }
  })
  const velInitial = useDataTexture(gl, randomVelocityData, size, size, () => {
    return { minMag: gl.NEAREST, ...RGBA }
  })

  const velocityDFBO = useDoubleFBO(gl, size, size, () => {
    return { type: halfFloat, minMag: gl.NEAREST, ...RGBA }
  })
  const positionDFBO = useDoubleFBO(gl, size, size, () => {
    return { type: halfFloat, minMag: gl.NEAREST, ...RGBA }
  })

  const memoized = useMemo(() => {
    let isInitialRender = true

    const renderToBuffer = (() => {
      // prettier-ignore
      const verts = new Float32Array([
        -1.0, +1.0, +0.0, 
        -1.0, -1.0, +0.0, 
        +1.0, -1.0, +0.0, 
        +1.0, +1.0, +0.0,
      ])
      const index = new Uint16Array([0, 1, 2, 0, 2, 3])
      const vertsBuffer = gl.createBuffer()
      const indexBuffer = gl.createBuffer()

      return buffer => {
        gl.bindBuffer(gl.ARRAY_BUFFER, vertsBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW)
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(0)

        gl.bindFramebuffer(gl.FRAMEBUFFER, buffer)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      }
    })()

    function compute(elapsed, delta) {
      gl.viewport(0, 0, size, size)

      // **********************************************
      // POSTION
      // **********************************************
      gl.useProgram(posProgram)

      gl.uniform2f(posUniforms.resolution, size, size)
      gl.uniform1f(posUniforms.delta, delta)
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
      gl.uniform1f(velUniforms.delta, delta)
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

      return [positionDFBO, velocityDFBO]
    }

    compute(0, 0)

    return compute
  }, [
    gl,
    size,
    texUnit1,
    texUnit2,
    positionDFBO,
    posInitial,
    posProgram,
    posUniforms,
    velocityDFBO,
    velInitial,
    velProgram,
    velUniforms,
  ])

  return memoized
}
