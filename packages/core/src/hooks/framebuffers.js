import { useEffect, useMemo } from 'react'
import { useDataTexture } from '..'
import warn from 'warning'

const prefix = 'react-vertex:'

export function useFrameBuffer(gl) {
  const memoized = useMemo(() => {
    const buffer = gl.createFramebuffer()

    warn(!!buffer, `${prefix} Failed to create frame buffer.`)

    return buffer
  }, [gl])

  useEffect(() => {
    return () => gl.deleteFramebuffer(memoized)
  }, [gl, memoized])

  return memoized
}

export function useFBO(gl, width, height, getTexOpts) {
  const tex = useDataTexture(gl, null, width, height, getTexOpts)
  const fbo = useFrameBuffer(gl)

  const memoized = useMemo(() => {
    const attachment = gl.COLOR_ATTACHMENT0
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, tex, 0)

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

export function useDoubleFBO(gl, width, height, getTexOpts) {
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
