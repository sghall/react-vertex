import { mat2, mat3, mat4 } from 'gl-matrix'
import { useMemo, useEffect } from 'react'
import { useSceneNode } from '..'

import { GLContext } from '../types'

export function useUniformSampler2d(
  gl: GLContext,
  program: WebGLProgram,
  name: string,
  texture: WebGLTexture,
) {
  const scene = useSceneNode()

  const unit = useMemo(() => {
    return scene.getTextureUnit(texture)
  }, [scene, texture])

  const memoized = useMemo(() => {
    const location = gl.getUniformLocation(program, name)
    gl.uniform1i(location, unit)

    return location
  }, [gl, program, name, unit])

  useEffect(() => {
    return () => scene.releaseTextureUnit(unit)
  }, [scene, unit])

  return [unit, memoized]
}

// *************************************************
// Matrix Uniforms
// *************************************************

type MatrixUniformType =
  | 'uniformMatrix2fv'
  | 'uniformMatrix3fv'
  | 'uniformMatrix4fv'

function useMatrixUniform(
  gl: GLContext,
  program: WebGLProgram,
  name: string,
  value: any,
  type: MatrixUniformType,
) {
  const memoized = useMemo(() => {
    return gl.getUniformLocation(program, name)
  }, [gl, program, name])

  useEffect(() => {
    gl.useProgram(program)
    gl[type](memoized, false, value)
  }, [gl, program, type, memoized, value])

  return memoized
}

export function useUniformMatrix2fv(
  gl: GLContext,
  program: WebGLProgram,
  name: string,
  value: mat2,
) {
  return useMatrixUniform(gl, program, name, value, 'uniformMatrix2fv')
}

export function useUniformMatrix3fv(
  gl: GLContext,
  program: WebGLProgram,
  name: string,
  value: mat3,
) {
  return useMatrixUniform(gl, program, name, value, 'uniformMatrix3fv')
}

export function useUniformMatrix4fv(
  gl: GLContext,
  program: WebGLProgram,
  name: string,
  value: mat4,
) {
  return useMatrixUniform(gl, program, name, value, 'uniformMatrix4fv')
}

// *************************************************
// Number Uniforms
// *************************************************

type NumberUniformType = 'uniform1f' | 'uniform1i'

function useNumberUniform(
  gl: GLContext,
  program: WebGLProgram,
  name: string,
  value: any,
  type: NumberUniformType,
) {
  const memoized = useMemo(() => {
    return gl.getUniformLocation(program, name)
  }, [gl, program, name])

  useEffect(() => {
    gl.useProgram(program)
    gl[type](memoized, value)
  }, [gl, program, type, memoized, value])

  return memoized
}

export function useUniform1f(
  gl: GLContext,
  program: WebGLProgram,
  name: string,
  value: number,
) {
  return useNumberUniform(gl, program, name, value, 'uniform1f')
}

export function useUniform1i(
  gl: GLContext,
  program: WebGLProgram,
  name: string,
  value: number,
) {
  return useNumberUniform(gl, program, name, value, 'uniform1i')
}

// *************************************************
// Vector Uniforms
// *************************************************

type VectorUniformType =
  | 'uniform1fv'
  | 'uniform1iv'
  | 'uniform2fv'
  | 'uniform2iv'
  | 'uniform3fv'
  | 'uniform3iv'
  | 'uniform4fv'
  | 'uniform4iv'

function useVectorUniform(
  gl: GLContext,
  program: WebGLProgram,
  name: string,
  value: number[],
  type: VectorUniformType,
) {
  const memoized = useMemo(() => {
    return gl.getUniformLocation(program, name)
  }, [gl, program, name])

  useEffect(() => {
    gl.useProgram(program)
    gl[type](memoized, value)
  }, [gl, program, type, memoized, value])

  return memoized
}

export function useUniform1fv(
  gl: GLContext,
  program: WebGLProgram,
  name: string,
  value: number[],
) {
  return useVectorUniform(gl, program, name, value, 'uniform1fv')
}

export function useUniform1iv(
  gl: GLContext,
  program: WebGLProgram,
  name: string,
  value: number[],
) {
  return useVectorUniform(gl, program, name, value, 'uniform1iv')
}

export function useUniform2fv(
  gl: GLContext,
  program: WebGLProgram,
  name: string,
  value: number[],
) {
  return useVectorUniform(gl, program, name, value, 'uniform2fv')
}

export function useUniform2iv(
  gl: GLContext,
  program: WebGLProgram,
  name: string,
  value: number[],
) {
  return useVectorUniform(gl, program, name, value, 'uniform2iv')
}

export function useUniform3fv(
  gl: GLContext,
  program: WebGLProgram,
  name: string,
  value: number[],
) {
  return useVectorUniform(gl, program, name, value, 'uniform3fv')
}

export function useUniform3iv(
  gl: GLContext,
  program: WebGLProgram,
  name: string,
  value: number[],
) {
  return useVectorUniform(gl, program, name, value, 'uniform3iv')
}

export function useUniform4fv(
  gl: GLContext,
  program: WebGLProgram,
  name: string,
  value: number[],
) {
  return useVectorUniform(gl, program, name, value, 'uniform4fv')
}

export function useUniform4iv(
  gl: GLContext,
  program: WebGLProgram,
  name: string,
  value: number[],
) {
  return useVectorUniform(gl, program, name, value, 'uniform4iv')
}
