import { useMemo } from 'react'

export function useAttribute(gl, size, buffer, getOptions) {
  const memoized = useMemo(() => {
    return function(location) {
      if (location >= 0) {
        const options = getOptions ? getOptions(gl) : {}
        const target = options.target || gl.ARRAY_BUFFER

        gl.enableVertexAttribArray(location)
        gl.bindBuffer(target, buffer)

        const type = options.type || gl.FLOAT
        const normalized = options.normalized || false
        const stride = options.stride || 0
        const offset = options.offset || 0

        gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
      }
    }
  }, [gl, size, buffer, getOptions])

  return memoized
}

export function useInstancedAttribute(gl, size, buffer, getOptions) {
  const memoized = useMemo(() => {
    return function(location, ext, version) {
      if (location >= 0) {
        const options = getOptions ? getOptions(gl) : {}
        const target = options.target || gl.ARRAY_BUFFER

        gl.enableVertexAttribArray(location)
        gl.bindBuffer(target, buffer)

        const type = options.type || gl.FLOAT
        const normalized = options.normalized || false
        const stride = options.stride || 0
        const offset = options.offset || 0

        gl.vertexAttribPointer(location, size, type, normalized, stride, offset)

        if (version === 2) {
          gl.vertexAttribDivisor(location, 1)
        } else {
          ext.vertexAttribDivisorANGLE(location, 1)
        }
      }
    }
  }, [gl, size, buffer, getOptions])

  return memoized
}
