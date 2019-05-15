import throttle from 'lodash.throttle'
import Node from './GraphNode'
import {
  isCameraNode,
  isMaterialNode,
  isGeometryNode,
  isInstancedNode,
  instancedExt,
} from '.'
import { PointLights } from '../lights'

export const isSceneNode = Symbol('isSceneNode')

function getMode(ctx, modeString) {
  if (!modeString) {
    return ctx.TRIANGLES
  }

  switch (modeString) {
    case 'TRIANGLES':
      return ctx.TRIANGLES
    case 'LINES':
      return ctx.LINES
    case 'POINTS':
      return ctx.POINTS
    case 'LINE_STRIP':
      return ctx.LINE_STRIP
    case 'LINE_LOOP':
      return ctx.LINE_LOOP
    case 'TRIANGLE_STRIP':
      return ctx.TRIANGLE_STRIP
    case 'TRIANGLE_FAN':
      return ctx.TRIANGLE_FAN
    default:
      return ctx.TRIANGLES
  }
}

export class SceneNode extends Node {
  constructor(canvas, extensions, attrs) {
    super()

    const context = canvas.getContext('webgl', attrs)

    this.context = context
    this.element = canvas
    this.extensions = extensions.map(ext => {
      return context.getExtension(ext)
    })
  }

  [isSceneNode] = true
  renderOnUpdate = false
  clearColor = [0, 0, 0, 1]
  activeAttributes = null
  extensions = {}

  pointLights = new PointLights()

  render = () => {
    const gl = this.context

    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(...this.clearColor)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const needsMatrixUpdate = this.needsMatrixUpdate === true

    if (needsMatrixUpdate) {
      this.updateMatrix()
      this.updateWorldMatrix()
      this.needsMatrixUpdate = false
    }

    for (let i = 0; i < this.children.length; i++) {
      this.renderNode(this.children[i], null, null, needsMatrixUpdate)
    }
  }

  requestRender = throttle(this.render, 17)

  renderNode(node, activeCamera, activeProgram, needsMatrixUpdate) {
    const gl = this.context

    // *************************************************
    // UPDATE MATRIX IF NEEDED
    // *************************************************
    needsMatrixUpdate = needsMatrixUpdate || node.needsMatrixUpdate === true

    if (needsMatrixUpdate) {
      node.updateMatrix()
      node.updateWorldMatrix()
      node.needsMatrixUpdate = false
    }

    // *************************************************
    // HANDLE CAMERA
    // *************************************************

    if (node[isCameraNode] === true) {
      activeCamera = node
    }

    // *************************************************
    // HANDLE MATERIAL
    // *************************************************

    if (node[isMaterialNode] === true) {
      activeProgram = node.program

      gl.useProgram(activeProgram)

      const { view, projection } = activeCamera

      const viewMatrix = gl.getUniformLocation(activeProgram, 'viewMatrix')
      gl.uniformMatrix4fv(viewMatrix, false, view)

      const projectionMatrix = gl.getUniformLocation(
        activeProgram,
        'projectionMatrix',
      )
      gl.uniformMatrix4fv(projectionMatrix, false, projection)
    }

    // *************************************************
    // HANDLE GEOMETRY
    // *************************************************

    if (node[isGeometryNode] === true) {
      gl.useProgram(activeProgram)

      if (node.attributes !== this.activeAttributes) {
        for (const attr in node.attributes) {
          const location = gl.getAttribLocation(activeProgram, attr)
          node.attributes[attr](location)
        }

        this.activeAttributes = node.attributes
      }

      const model = gl.getUniformLocation(activeProgram, 'modelMatrix')
      gl.uniformMatrix4fv(model, false, node.worldMatrix)

      if (node.drawArrays) {
        gl.drawArrays(
          getMode(gl, node.drawArrays.mode),
          node.drawArrays.first || 0,
          node.drawArrays.count,
        )
      } else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, node.index)

        gl.drawElements(
          getMode(gl, node.drawElements.mode),
          node.drawElements.count,
          node.drawElements.type || gl.UNSIGNED_SHORT,
          node.drawElements.offset || 0,
        )
      }

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    // *************************************************
    // HANDLE INSTANCED GEOMETRY
    // *************************************************

    if (node[isInstancedNode] === true) {
      gl.useProgram(activeProgram)

      if (this.extensions[instancedExt] === undefined) {
        this.extensions[instancedExt] = gl.getExtension(instancedExt)
      }

      const ext = this.extensions[instancedExt]

      if (node.attributes !== this.activeAttributes) {
        for (const attr in node.attributes) {
          const location = gl.getAttribLocation(activeProgram, attr)
          node.attributes[attr](location, ext)
        }

        this.activeAttributes = node.attributes
      }

      const model = gl.getUniformLocation(activeProgram, 'modelMatrix')
      gl.uniformMatrix4fv(model, false, node.worldMatrix)

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, node.index)

      ext.drawElementsInstancedANGLE(
        getMode(gl, node.drawElements.mode),
        node.drawElements.count,
        node.drawElements.type || gl.UNSIGNED_SHORT,
        node.drawElements.offset || 0,
        node.drawElements.primcount,
      )

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    for (let i = 0; i < node.children.length; i++) {
      this.renderNode(
        node.children[i],
        activeCamera,
        activeProgram,
        needsMatrixUpdate,
      )
    }
  }
}
