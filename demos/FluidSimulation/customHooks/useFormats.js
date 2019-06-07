import { useMemo } from 'react'
import { useWebGLVersion } from '@react-vertex/core'

function supportRenderTextureFormat(gl, internalFormat, format, type) {
  let texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null)

  let fbo = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  )

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

  return {
    internalFormat,
    format,
  }
}

export default function useFormats(gl) {
  const version = useWebGLVersion()

  const memoized = useMemo(() => {
    let texHalfFLoat
    let hasLinear

    const webgl2 = version === 2

    if (webgl2) {
      gl.getExtension('EXT_color_buffer_float')
      hasLinear = !!gl.getExtension('OES_texture_float_linear')
    } else {
      texHalfFLoat = gl.getExtension('OES_texture_half_float')
      hasLinear = !!gl.getExtension('OES_texture_half_float_linear')
    }

    const halfFloat = webgl2 ? gl.HALF_FLOAT : texHalfFLoat.HALF_FLOAT_OES

    let RGBA, RG, R

    if (webgl2) {
      RGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloat)
      RG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloat)
      R = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloat)
    } else {
      RGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloat)
      RG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloat)
      R = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloat)
    }

    return {
      RGBA,
      RG,
      R,
      halfFloat,
      hasLinear,
    }
  }, [gl, version])

  return memoized
}
