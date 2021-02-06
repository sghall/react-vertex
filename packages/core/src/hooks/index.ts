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
    throw Error(`useRender ${ctxErr}`)
  }

  if (!context.scene) {
    throw Error('The scene is not on the context.')
  }

  return context.scene.render
}

export function useWebGLContext() {
  const context = useContext(ReactVertexContext)

  if (!context) {
    throw new Error(`useWebGLContext ${ctxErr}`)
  }

  if (!context.scene) {
    throw Error('The scene is not on the context.')
  }

  return context.scene.context
}

export function useWebGLVersion() {
  const context = useContext(ReactVertexContext)

  if (!context) {
    throw new Error(`useWebGLVersion ${ctxErr}`)
  }

  if (!context.scene) {
    throw Error('The scene is not on the context.')
  }

  return context.scene.webglVersion
}

export function useSceneNode() {
  const context = useContext(ReactVertexContext)

  if (!context.scene) {
    throw Error('The scene is not on the context.')
  }

  return context.scene
}

export function useCanvas() {
  const context = useContext(ReactVertexContext)

  if (!context) {
    throw new Error(`useCanvas ${ctxErr}`)
  }

  if (!context.scene) {
    throw Error('The scene is not on the context.')
  }

  return context.scene.element
}

export function useCanvasSize() {
  const context = useContext(ReactVertexContext)

  if (!context) {
    throw new Error(`useCanvasSize ${ctxErr}`)
  }

  if (!context.scene) {
    throw Error('The scene is not on the context.')
  }

  const memoized = useMemo(() => {
    return {
      width: context.width,
      clientWidth: context.scene?.element.clientWidth || context.width,
      height: context.height,
      clientHeight: context.scene?.element.clientHeight || context.height,
    }
  }, [context.width, context.height, context.scene.element])

  return memoized
}
