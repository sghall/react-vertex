import { useContext, useMemo, useEffect } from 'react'
import ReactVertexContext from '../Context'
import { useUniform3fv } from './uniforms'

export * from './shaders'
export * from './buffers'
export * from './attributes'
export * from './uniforms'
export * from './textures'

const ctxErr = 'hook must be used in a React Vertex component tree.'

export function useRender() {
  const context = useContext(ReactVertexContext)

  if (!context) {
    throw new Error(`useRender ${ctxErr}`)
  }

  return context.scene.render
}

export function useWebGLContext() {
  const context = useContext(ReactVertexContext)

  if (!context) {
    throw new Error(`useWebGLContext ${ctxErr}`)
  }

  return context.scene.context
}

export function useCanvas() {
  const context = useContext(ReactVertexContext)

  if (!context) {
    throw new Error(`useCanvas ${ctxErr}`)
  }

  return context.scene.element
}

export function useCanvasSize() {
  const context = useContext(ReactVertexContext)

  if (!context) {
    throw new Error(`useCanvasSize ${ctxErr}`)
  }

  const memoized = useMemo(() => {
    return { width: context.width, height: context.height }
  }, [context.width, context.height])

  return memoized
}

export function usePointLight(diffuse, position) {
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
    pointLights.updateDiffuse(light, diffuse)
  }, [pointLights, light, diffuse])

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
