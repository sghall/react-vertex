import { useContext, useMemo, useEffect } from 'react'
import ReactVertexContext from '../Context'
import { ctxErr, useUniform3fv } from '..'

export function usePointLight(color, position) {
  const context = useContext(ReactVertexContext)

  if (!context) {
    throw new Error(`usePointLight ${ctxErr}`)
  }

  const pointLights = useMemo(() => {
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

export function usePointLightUniforms(gl, program) {
  const context = useContext(ReactVertexContext)

  if (!context) {
    throw new Error(`usePointLightUniforms ${ctxErr}`)
  }

  useUniform3fv(gl, program, 'pointLd', context.scene.pointLights.diffuse)
  useUniform3fv(gl, program, 'pointLp', context.scene.pointLights.position)
}

export function usePointLightCount(vertSource, fragSource) {
  const context = useContext(ReactVertexContext)

  if (!context) {
    throw new Error(`usePointLightCount ${ctxErr}`)
  }

  const memoizedVert = useMemo(() => {
    const count = context.scene.pointLights.instances.length
    return vertSource.replace('<<NUM_POINT_LIGHTS>>', count)
  }, [vertSource, context.scene.pointLights.instances.length])

  const memoizedFrag = useMemo(() => {
    const count = context.scene.pointLights.instances.length
    return fragSource.replace('<<NUM_POINT_LIGHTS>>', count)
  }, [fragSource, context.scene.pointLights.instances.length])

  return [memoizedVert, memoizedFrag]
}
