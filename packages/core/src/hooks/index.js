import { useContext, useMemo } from 'react'
import ReactVertexContext from '../Context'

export * from './shaders'
export * from './buffers'
export * from './lights'
export * from './attributes'
export * from './uniforms'
export * from './textures'

export const ctxErr = 'hook must be used in a React Vertex component tree.'

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
