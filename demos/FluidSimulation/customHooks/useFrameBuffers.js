import { useMemo } from 'react'
import { useDataTexture, useFrameBuffer } from '@react-vertex/core'

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

function useDoubleFBO(gl, width, height, type, getTexOpts) {
  const frameBuffer1 = useFBO(gl, width, height, type, getTexOpts)
  const frameBuffer2 = useFBO(gl, width, height, type, getTexOpts)

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

function useFrameBuffers(gl, dyeSize, simSize, floatType, minMag) {
  const getOptsIfLinear = () => ({ type: floatType, minMag })
  const getOptsUseNearest = () => ({ type: floatType, minMag: gl.NEAREST })

  const curlFBO = useFBO(gl, ...simSize, getOptsUseNearest)
  const divergenceFBO = useFBO(gl, ...simSize, getOptsUseNearest)
  const densityDFBO = useDoubleFBO(gl, ...dyeSize, getOptsIfLinear)
  const pressureDFBO = useDoubleFBO(gl, ...simSize, getOptsUseNearest)
  const velocityDFBO = useDoubleFBO(gl, ...simSize, getOptsIfLinear)

  const memoized = useMemo(() => {
    return {
      curlFBO,
      divergenceFBO,
      densityDFBO,
      pressureDFBO,
      velocityDFBO,
    }
  }, [curlFBO, divergenceFBO, densityDFBO, pressureDFBO, velocityDFBO])

  return memoized
}

export default useFrameBuffers
