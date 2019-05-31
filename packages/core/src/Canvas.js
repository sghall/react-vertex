import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import ReactVertexReconciler, { SceneNode } from './Reconciler'
import ReactVertexContext from './Context'

export default class Canvas extends Component {
  canvas = createRef()

  componentDidMount() {
    const { current } = this.canvas
    const {
      clearColor,
      children,
      antialias,
      textureFlip,
      contextAttrs = {},
      extensions = [],
      renderOnUpdate,
    } = this.props

    const attrs = { antialias, ...contextAttrs }

    this.sceneNode = new SceneNode(current, extensions, attrs)
    this.sceneNode.clearColor = clearColor
    this.sceneNode.renderOnUpdate = renderOnUpdate

    window.sceneNode = this.sceneNode

    const { width, height } = this.updateDimensions()

    this.container = ReactVertexReconciler.createContainer(this.sceneNode)

    const gl = this.sceneNode.context
    textureFlip && gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    this.contextObject = { scene: this.sceneNode, width, height }

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

    const { width, height } = this.updateDimensions()

    this.contextObject.width = width
    this.contextObject.height = height

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

    if (nextWidth !== current.width || nextHeight !== current.height) {
      current.style.width = `${width}px`
      current.style.height = `${height}px`
      current.width = nextWidth
      current.height = nextHeight

      renderOnResize && this.sceneNode.requestRender()
    }

    return { width: nextWidth, height: nextHeight }
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
  antialias: false,
  textureFlip: true,
  renderOnUpdate: false,
  renderOnResize: true,
}
