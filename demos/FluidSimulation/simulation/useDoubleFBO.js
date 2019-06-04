import { useMemo } from 'react'
import { useDataTexture, useFrameBuffer } from '@react-vertex/core'

export function useFBO(gl, size, format, type, minMag) {
  const [w, h] = size
  
  const texture = useDataTexture(gl, null, w, h, () => ({
    type,
    minMag,
    ...format,
  }))

  const frameBuffer = useFrameBuffer(gl)

  useMemo(() => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    )
    gl.viewport(0, 0, w, h)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }, [gl, frameBuffer, texture, w, h])

  return {
    texture,
    fbo: frameBuffer,
    width: w,
    height: h,
    attach(id) {
      gl.activeTexture(gl.TEXTURE0 + id)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      return id
    },
  }
}

export function useDoubleFBO(gl, size, format, type, minMag) {
  const frameBuffer1 = useFBO(gl, size, format, type, minMag)
  const frameBuffer2 = useFBO(gl, size, format, type, minMag)

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
