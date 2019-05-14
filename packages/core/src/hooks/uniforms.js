import { useMemo, useEffect } from 'react'

export function useUniformSampler2d(gl, program, name, texture, unit) {
  const memoized = useMemo(() => {
    const location = gl.getUniformLocation(program, name)
    gl.uniform1i(location, unit)
    return location
  }, [gl, program, name, unit])

  gl.activeTexture(gl[`TEXTURE${unit}`])
  gl.bindTexture(gl.TEXTURE_2D, texture)

  return memoized
}

export function useMatrixUniform(gl, program, name, value, type) {
  const memoized = useMemo(() => {
    return gl.getUniformLocation(program, name)
  }, [gl, program, name])

  useEffect(() => {
    gl.useProgram(program)
    gl[type](memoized, false, value)
  }, [gl, program, type, memoized, value])

  return memoized
}

export function useUniformMatrix2fv(gl, program, name, value) {
  return useMatrixUniform(gl, program, name, value, 'uniformMatrix2fv')
}

export function useUniformMatrix3fv(gl, program, name, value) {
  return useMatrixUniform(gl, program, name, value, 'uniformMatrix3fv')
}

export function useUniformMatrix4fv(gl, program, name, value) {
  return useMatrixUniform(gl, program, name, value, 'uniformMatrix4fv')
}

export function useVectorUniform(gl, program, name, value, type) {
  const memoized = useMemo(() => {
    return gl.getUniformLocation(program, name)
  }, [gl, program, name])

  useEffect(() => {
    gl.useProgram(program)
    gl[type](memoized, value)
  }, [gl, program, type, memoized, value])

  return memoized
}

export function useUniform1f(gl, program, name, value) {
  return useVectorUniform(gl, program, name, value, 'uniform1f')
}

export function useUniform1i(gl, program, name, value) {
  return useVectorUniform(gl, program, name, value, 'uniform1i')
}

export function useUniform1fv(gl, program, name, value) {
  return useVectorUniform(gl, program, name, value, 'uniform1fv')
}

export function useUniform1iv(gl, program, name, value) {
  return useVectorUniform(gl, program, name, value, 'uniform1iv')
}

export function useUniform2fv(gl, program, name, value) {
  return useVectorUniform(gl, program, name, value, 'uniform2fv')
}

export function useUniform2iv(gl, program, name, value) {
  return useVectorUniform(gl, program, name, value, 'uniform2iv')
}

export function useUniform3fv(gl, program, name, value) {
  return useVectorUniform(gl, program, name, value, 'uniform3fv')
}

export function useUniform3iv(gl, program, name, value) {
  return useVectorUniform(gl, program, name, value, 'uniform3iv')
}

export function useUniform4fv(gl, program, name, value) {
  return useVectorUniform(gl, program, name, value, 'uniform4fv')
}

export function useUniform4iv(gl, program, name, value) {
  return useVectorUniform(gl, program, name, value, 'uniform4iv')
}

export function useVectorValueUniform(gl, program, name, type, values) {
  const memoized = useMemo(() => {
    return gl.getUniformLocation(program, name)
  }, [gl, program, name])

  useEffect(() => {
    gl.useProgram(program)
    gl[type](memoized, ...values)
  }, [gl, program, type, memoized, ...values]) // eslint-disable-line

  return memoized
}

export function useUniform2f(gl, program, name, ...values) {
  return useVectorValueUniform(gl, program, name, 'uniform2f', values)
}

export function useUniform2i(gl, program, name, ...values) {
  return useVectorValueUniform(gl, program, name, 'uniform2i', values)
}

export function useUniform3f(gl, program, name, ...values) {
  return useVectorValueUniform(gl, program, name, 'uniform3f', values)
}

export function useUniform3i(gl, program, name, ...values) {
  return useVectorValueUniform(gl, program, name, 'uniform3i', values)
}

export function useUniform4f(gl, program, name, ...values) {
  return useVectorValueUniform(gl, program, name, 'uniform4f', values)
}

export function useUniform4i(gl, program, name, ...values) {
  return useVectorValueUniform(gl, program, name, 'uniform4i', values)
}
