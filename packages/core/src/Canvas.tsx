import ReactReconciler from 'react-reconciler'
import React, { Component, createRef } from 'react'
import ReactVertexReconciler, { SceneNode } from './Reconciler'
import ReactVertexContext from './Context'

import { CanvasProps } from './types'

export default class Canvas extends Component<CanvasProps> {
  sceneNode?: SceneNode

  state = {
    error: false,
    message: '',
  }

  canvas = createRef<HTMLCanvasElement>()
  container?: ReactReconciler.FiberRoot
  contextObject?: {
    scene: SceneNode
    width: number
    height: number
  }

  componentDidMount() {
    const { current } = this.canvas
    const {
      webgl1 = true,
      webgl2 = false,
      clearColor = [0, 0, 0, 1],
      children,
      antialias = false,
      textureFlip = true,
      contextAttrs = {},
      extensions = [],
      renderOnUpdate = false,
    } = this.props

    const attrs = { antialias, ...contextAttrs }

    if (!current) {
      return
    }

    let gl, webglVersion

    if (webgl2) {
      gl = current.getContext('webgl2', attrs)
      webglVersion = 2
    }

    if (!gl && webgl1) {
      gl = current.getContext('webgl', attrs)
      webglVersion = 1
    }

    if (!gl) {
      this.setState({ error: true, message: 'Could not create WebGL context.' })
      return
    }

    textureFlip && gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    this.sceneNode = new SceneNode(current, extensions, gl)

    if (typeof webglVersion === 'number') {
      this.sceneNode.webglVersion = webglVersion
    }

    this.sceneNode.clearColor = clearColor
    this.sceneNode.renderOnUpdate = renderOnUpdate

    if (typeof window === 'object') {
      // @ts-ignore
      window.sceneNode = this.sceneNode
    }

    const update = this.updateDimensions()

    if (update) {
      this.contextObject = {
        scene: this.sceneNode,
        width: update.width,
        height: update.height,
      }
    }

    this.container = ReactVertexReconciler.createContainer(
      this.sceneNode,
      false,
      false,
    )

    if (this.contextObject) {
      ReactVertexReconciler.updateContainer(
        <ReactVertexContext.Provider value={this.contextObject}>
          {children}
        </ReactVertexContext.Provider>,
        this.container,
        this,
        () => {},
      )
    }
  }

  componentDidUpdate() {
    const { children } = this.props

    const dims = this.updateDimensions()

    if (dims && dims.update && this.contextObject) {
      this.contextObject = {
        ...this.contextObject,
        width: dims.width,
        height: dims.height,
      }
    }

    if (this.container && this.contextObject) {
      ReactVertexReconciler.updateContainer(
        <ReactVertexContext.Provider value={this.contextObject}>
          {children}
        </ReactVertexContext.Provider>,
        this.container,
        this,
        () => {},
      )
    }
  }

  updateDimensions() {
    const { current } = this.canvas

    if (!current) {
      return
    }

    const { width, height, renderOnResize } = this.props

    const devicePixelRatio = window.devicePixelRatio || 1

    const nextWidth = Math.round(width * devicePixelRatio)
    const nextHeight = Math.round(height * devicePixelRatio)

    const update = nextWidth !== current.width || nextHeight !== current.height

    if (update) {
      current.style.width = `${width}px`
      current.style.height = `${height}px`
      current.width = nextWidth
      current.height = nextHeight

      renderOnResize && this.sceneNode && this.sceneNode.requestRender()
    }

    return { width: nextWidth, height: nextHeight, update }
  }

  renderScene = () => {
    if (this.sceneNode) {
      this.sceneNode.render()
    }
  }

  componentWillUnmount() {
    if (this.container) {
      ReactVertexReconciler.updateContainer(
        null,
        this.container,
        this,
        () => {},
      )
    }
  }

  render() {
    const { canvasClass = '', canvasStyle = {} } = this.props

    return (
      <canvas ref={this.canvas} className={canvasClass} style={canvasStyle} />
    )
  }
}
