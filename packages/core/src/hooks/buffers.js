import { useEffect, useMemo } from 'react'
import warn from 'warning'

const prefix = 'react-vertex:'

export function useTypedArray(data, format) {
  const memoized = useMemo(() => {
    let contents = data

    if (format && typeof format === 'string') {
      switch (format.toUpperCase()) {
        case 'U8':
          contents = Uint8Array.from(data)
          break
        case 'U16':
          contents = Uint16Array.from(data)
          break
        case 'U32':
          contents = Uint32Array.from(data)
          break
        case 'I8':
          contents = Int8Array.from(data)
          break
        case 'I16':
          contents = Int16Array.from(data)
          break
        case 'I32':
          contents = Int32Array.from(data)
          break
        case 'F32':
          contents = Float32Array.from(data)
          break
      }
    }

    return contents
  }, [data, format])

  return memoized
}

export function useBuffer(gl, data, isIndex = false, format, usage) {
  const contents = useTypedArray(data, format)

  const memoized = useMemo(() => {
    const buffer = gl.createBuffer()

    warn(!!buffer, `${prefix} Failed to create buffer.`)

    return buffer
  }, [gl])

  useMemo(() => {
    if (isIndex) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, memoized)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, contents, usage)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    } else {
      gl.bindBuffer(gl.ARRAY_BUFFER, memoized)
      gl.bufferData(gl.ARRAY_BUFFER, contents, usage)
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }
  }, [gl, isIndex, usage, contents, memoized])

  useEffect(() => {
    return () => gl.isBuffer(memoized) && gl.deleteBuffer(memoized)
  }, [gl, memoized])

  return memoized
}

export function useStaticBuffer(gl, data, isIndex = false, format = null) {
  return useBuffer(gl, data, isIndex, format, gl.STATIC_DRAW)
}

export function useStreamBuffer(gl, data, isIndex = false, format = null) {
  return useBuffer(gl, data, isIndex, format, gl.STREAM_DRAW)
}

export function useDyanmicBuffer(gl, data, isIndex = false, format = null) {
  return useBuffer(gl, data, isIndex, format, gl.DYNAMIC_DRAW)
}

export function useRenderBuffer(gl, width, height, format) {
  const memoized = useMemo(() => {
    const buffer = gl.createRenderbuffer()

    warn(!!buffer, `${prefix} Failed to create render buffer.`)

    gl.bindRenderbuffer(gl.RENDERBUFFER, buffer)

    const frmt = format || gl.DEPTH_COMPONENT16
    gl.renderbufferStorage(gl.RENDERBUFFER, frmt, width, height)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)

    return buffer
  }, [gl, width, height, format])

  useEffect(() => {
    return () => gl.deleteRenderbuffer(memoized)
  }, [gl, memoized])

  return memoized
}

export function useFrameBuffer(gl /*, texture, unitv*/) {
  const memoized = useMemo(() => {
    const buffer = gl.createFramebuffer()

    warn(!!buffer, `${prefix} Failed to create frame buffer.`)

    // gl.activeTexture(gl[`TEXTURE${unit}`])
    // gl.bindTexture(gl.TEXTURE_2D, texture)
    // gl.bindFramebuffer(gl.FRAMEBUFFER, buffer)

    // // prettier-ignore
    // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

    // gl.bindTexture(gl.TEXTURE_2D, null)
    // gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    return buffer
  }, [gl])

  useEffect(() => {
    return () => gl.deleteFramebuffer(memoized)
  }, [gl, memoized])

  return memoized
}
