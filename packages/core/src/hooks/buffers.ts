import { useEffect, useMemo } from 'react'
import warn from 'warning'

import { GLContext, DataFormat, DataArray } from '../types'

const prefix = 'react-vertex:'

export function useTypedArray(data: DataArray, format: DataFormat | null) {
  const memoized = useMemo(() => {
    let contents

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

    if (!contents) {
      if (
        data instanceof Uint8Array ||
        data instanceof Uint16Array ||
        data instanceof Uint32Array ||
        data instanceof Int8Array ||
        data instanceof Int16Array ||
        data instanceof Int32Array ||
        data instanceof Float32Array
      ) {
        return data
      } else {
        throw Error('Undable to return typed array instance.')
      }
    }

    return contents
  }, [data, format])

  return memoized
}

export function useBuffer(
  gl: GLContext,
  data: DataArray,
  isIndex: boolean = false,
  format: DataFormat | null,
  usage: number,
) {
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
    return () => {
      gl.isBuffer(memoized) && gl.deleteBuffer(memoized)
    }
  }, [gl, memoized])

  return memoized
}

export function useStaticBuffer(
  gl: GLContext,
  data: DataArray,
  isIndex: boolean = false,
  format: DataFormat | null = null,
) {
  return useBuffer(gl, data, isIndex, format, gl.STATIC_DRAW)
}

export function useStreamBuffer(
  gl: GLContext,
  data: DataArray,
  isIndex: boolean = false,
  format: DataFormat | null = null,
) {
  return useBuffer(gl, data, isIndex, format, gl.STREAM_DRAW)
}

export function useDyanmicBuffer(
  gl: GLContext,
  data: DataArray,
  isIndex: boolean = false,
  format: DataFormat | null = null,
) {
  return useBuffer(gl, data, isIndex, format, gl.DYNAMIC_DRAW)
}
