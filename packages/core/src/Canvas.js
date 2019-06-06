import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import ReactVertexReconciler, { SceneNode } from './Reconciler'
import ReactVertexContext from './Context'

export default class Canvas extends Component {
  state = {
    error: false,
    message: '',
  }

  canvas = createRef()

  componentDidMount() {
    const { current } = this.canvas
    const {
      webgl1,
      webgl2,
      clearColor,
      children,
      antialias,
      textureFlip,
      contextAttrs = {},
      extensions = [],
      renderOnUpdate,
    } = this.props

    const attrs = { antialias, ...contextAttrs }

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
    this.sceneNode.webglVersion = webglVersion
    this.sceneNode.clearColor = clearColor
    this.sceneNode.renderOnUpdate = renderOnUpdate

    if (typeof window === 'object') {
      window.sceneNode = this.sceneNode
    }

    const { width, height } = this.updateDimensions()
    this.contextObject = { scene: this.sceneNode, width, height }

    this.container = ReactVertexReconciler.createContainer(this.sceneNode)

    ReactVertexReconciler.updateContainer(
      <ReactVertexContext.Provider value={this.contextObject}>
        {children}
      </ReactVertexContext.Provider>,
      this.container,
      this,
    )
  }

  componentDidUpdate() {
    const { children } = this.props

    const { width, height, update } = this.updateDimensions()

    if (update) {
      this.contextObject = { ...this.contextObject, width, height }
    }

    ReactVertexReconciler.updateContainer(
      <ReactVertexContext.Provider value={this.contextObject}>
        {children}
      </ReactVertexContext.Provider>,
      this.container,
      this,
    )
  }

  updateDimensions() {
    const { current } = this.canvas
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

      renderOnResize && this.sceneNode.requestRender()
    }

    return { width: nextWidth, height: nextHeight, update }
  }

  renderScene = () => {
    if (this.sceneNode) {
      this.sceneNode.render()
    }
  }

  componentWillUnmount() {
    ReactVertexReconciler.updateContainer(null, this.container, this)
  }

  render() {
    const { canvasClass = '', canvasStyle = {} } = this.props

    return (
      <canvas ref={this.canvas} className={canvasClass} style={canvasStyle} />
    )
  }
}

Canvas.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  webgl1: PropTypes.bool,
  webgl2: PropTypes.bool,
  antialias: PropTypes.bool,
  textureFlip: PropTypes.bool,
  clearColor: PropTypes.array.isRequired,
  canvasClass: PropTypes.string,
  canvasStyle: PropTypes.object,
  extensions: PropTypes.arrayOf(PropTypes.string),
  contextAttrs: PropTypes.object,
  renderOnUpdate: PropTypes.bool,
  renderOnResize: PropTypes.bool,
}

Canvas.defaultProps = {
  clearColor: [0, 0, 0, 1],
  webgl1: true,
  webgl2: false,
  antialias: false,
  textureFlip: true,
  renderOnUpdate: false,
  renderOnResize: true,
}
