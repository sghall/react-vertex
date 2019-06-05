import { useContext, useMemo } from 'react'
import ReactVertexContext from '../Context'

export * from './shaders'
export * from './buffers'
export * from './framebuffers'
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

export function useSceneNode() {
  const context = useContext(ReactVertexContext)
  return context.scene
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
    return {
      width: context.width,
      clientWidth: context.scene.element.clientWidth,
      height: context.height,
      clientHeight: context.scene.element.clientHeight,
    }
  }, [context.width, context.height, context.scene.element])

  return memoized
}
