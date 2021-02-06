import { useContext, useMemo, useEffect } from 'react'
import ReactVertexContext from '../Context'
import { ctxErr, useUniform3fv } from '..'

import { GLContext } from '../types'

const white = [1, 1, 1]
const origin = [0, 0, 0]

export function usePointLight(color = white, position = origin) {
  const context = useContext(ReactVertexContext)

  if (!context) {
    throw new Error(`usePointLight ${ctxErr}`)
  }

  const pointLights = useMemo(() => {
    if (!context.scene) {
      throw Error('The scene is not on the context.')
    }

    return context.scene.pointLights
  }, [context])

  const light = useMemo(() => {
    return pointLights.add()
  }, [pointLights])

  useEffect(() => {
    pointLights.updateDiffuse(light, color)
  }, [pointLights, light, color])

  useEffect(() => {
    pointLights.updatePosition(light, position)
  }, [pointLights, light, position])

  useEffect(() => {
    return () => pointLights.remove(light)
  }, [pointLights, light])
}

export function usePointLightUniforms(gl: GLContext, program: WebGLProgram) {
  const context = useContext(ReactVertexContext)

  if (!context) {
    throw new Error(`usePointLightUniforms ${ctxErr}`)
  }

  if (!context.scene) {
    throw Error('The scene is not on the context.')
  }

  useUniform3fv(gl, program, 'pointLd', context.scene.pointLights.diffuse)
  useUniform3fv(gl, program, 'pointLp', context.scene.pointLights.position)
}

export function usePointLightCount(vertSource: string, fragSource: string) {
  const context = useContext(ReactVertexContext)

  if (!context) {
    throw new Error(`usePointLightCount ${ctxErr}`)
  }

  if (!context.scene) {
    throw Error('The scene is not on the context.')
  }

  const memoizedVert = useMemo(() => {
    if (!context.scene) {
      throw Error('The scene is not on the context.')
    }

    const count = context.scene.pointLights.instances.length
    return vertSource.replace('<<NUM_POINT_LIGHTS>>', `${count}`)
  }, [vertSource, context.scene.pointLights.instances.length])

  const memoizedFrag = useMemo(() => {
    if (!context.scene) {
      throw Error('The scene is not on the context.')
    }

    const count = context.scene.pointLights.instances.length
    return fragSource.replace('<<NUM_POINT_LIGHTS>>', `${count}`)
  }, [fragSource, context.scene.pointLights.instances.length])

  return [memoizedVert, memoizedFrag]
}
