import { useMemo } from 'react'

import { GLContext, GetAttributeOptions } from '../types'

export function useAttribute(
  gl: GLContext,
  size: number,
  buffer: WebGLBuffer,
  getOptions: GetAttributeOptions,
) {
  const memoized = useMemo(() => {
    return function(location: number) {
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

export function useInstancedAttribute(
  gl: GLContext,
  size: number,
  buffer: WebGLBuffer,
  getOptions: GetAttributeOptions,
) {
  const memoized = useMemo(() => {
    return function(location: number, ext?: ANGLE_instanced_arrays) {
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

        if (gl instanceof WebGL2RenderingContext) {
          gl.vertexAttribDivisor(location, 1)
        } else if (ext) {
          ext.vertexAttribDivisorANGLE(location, 1)
        } else {
          console.log('Instanced attributes require WebGL 2 or ANGLE extension')
        }
      }
    }
  }, [gl, size, buffer, getOptions])

  return memoized
}
