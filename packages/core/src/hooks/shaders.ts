import { useMemo, useEffect } from 'react'
import warn from 'warning'

import { GLContext } from '../types'

const prefix = 'react-vertex:'

function log(source: string) {
  if (typeof source !== 'string') {
    warn(false, `${prefix} Shader source should be a string!`)
    return ''
  }

  const lines = source.split('\n')

  for (let i = 0; i < lines.length; i++) {
    lines[i] = i + 1 + ': ' + lines[i]
  }

  return lines.join('\n')
}

function useShader(gl: GLContext, source: string, isVertShader = false) {
  const memoized = useMemo(() => {
    if (source.constructor === WebGLShader) {
      return source
    }

    const shaderType = isVertShader ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER
    const shader = gl.createShader(shaderType)

    let precision = 'lowp'

    // prettier-ignore
    if (gl.getShaderPrecisionFormat(shaderType, gl.HIGH_FLOAT)?.precision || 0 > 0) {
      precision = 'highp'
    } else if (gl.getShaderPrecisionFormat(shaderType, gl.MEDIUM_FLOAT)?.precision || 0 > 0) {
      precision = 'mediump'
    }

    const prepped = source.replace('<<FLOAT_PRECISION>>', precision)

    if (shader) {
      gl.shaderSource(shader, prepped)
      gl.compileShader(shader)

      warn(
        gl.getShaderParameter(shader, gl.COMPILE_STATUS),
        `${prefix}\n${gl.getShaderInfoLog(shader)}\n${log(prepped)}`,
      )
    } else {
      warn(false, `${prefix}\nShader could not be compiled. Source:\n${source}`)
    }

    return shader
  }, [gl, source, isVertShader])

  return memoized
}

export function useProgram(
  gl: GLContext,
  vertSource: string,
  fragSource: string,
) {
  const vert = useShader(gl, vertSource, true)
  const frag = useShader(gl, fragSource, false)

  const memoized = useMemo(() => {
    const program = gl.createProgram()

    if (program && vert && frag) {
      gl.attachShader(program, vert)
      gl.attachShader(program, frag)
      gl.linkProgram(program)

      warn(
        gl.getProgramParameter(program, gl.LINK_STATUS),
        `${prefix} Error creating program`,
      )
    } else {
      warn(false, `${prefix} Error creating program`)
    }

    return program
  }, [gl, vert, frag])

  useEffect(() => {
    return () => gl.deleteProgram(memoized)
  }, [gl, memoized])

  gl.useProgram(memoized)

  return memoized
}

export function useProgramUniforms(gl: GLContext, program: WebGLProgram) {
  const memoized = useMemo(() => {
    const uniforms: { [name: string]: WebGLUniformLocation | null } = {}

    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)

    for (let i = 0; i < uniformCount; i++) {
      const name = gl.getActiveUniform(program, i)?.name

      if (name) {
        uniforms[name] = gl.getUniformLocation(program, name)
      }
    }

    return uniforms
  }, [gl, program])

  return memoized
}
