import { mat4 } from 'gl-matrix'
import { isSceneNode } from './SceneNode'

export const isGraphNode = Symbol('isGraphNode')

export default class GraphNode {
  constructor() {
    this.children = []
    this.matrix = mat4.create()
    this.worldMatrix = mat4.create()
    this.needsMatrixUpdate = false
    this.userManagedMatrix = false
  }

  [isGraphNode] = true

  add(child) {
    child.parent = this
    child.updateWorldMatrix()
    this.children.push(child)
  }

  remove(child) {
    const index = this.children.findIndex(d => d === child)

    if (index >= 0) {
      delete this.children[index].parent
      this.children.splice(index, 1)
    }
  }

  updateWorldMatrix() {
    if (this[isSceneNode]) {
      mat4.copy(this.worldMatrix, this.matrix)
    } else if (this.parent) {
      mat4.multiply(this.worldMatrix, this.parent.worldMatrix, this.matrix)
    }
  }

  updateMatrix() {
    if (this.userManagedMatrix) {
      return
    }

    mat4.identity(this.matrix)

    if (this.position) {
      mat4.translate(this.matrix, this.matrix, this.position)
    }

    if (this.rotation) {
      const [x, y, z] = this.rotation
      x && mat4.rotateX(this.matrix, this.matrix, x)
      y && mat4.rotateY(this.matrix, this.matrix, y)
      z && mat4.rotateZ(this.matrix, this.matrix, z)
    }

    if (this.scale) {
      mat4.scale(this.matrix, this.matrix, this.scale)
    }
  }

  applyMatrixProps(nextprops, prevProps) {
    if (nextprops.matrix) {
      this.matrix = nextprops.matrix
      this.userManagedMatrix = true
      this.updateWorldMatrix()

      this.children.forEach(c => (c.needsMatrixUpdate = true))
    } else if (
      nextprops.position !== prevProps.position ||
      nextprops.rotation !== prevProps.rotation ||
      nextprops.scale !== prevProps.scale
    ) {
      this.position = nextprops.position
      this.rotation = nextprops.rotation
      this.scale = nextprops.scale

      this.needsMatrixUpdate = true
    }

    if (this.root.renderOnUpdate) {
      this.root.requestRender()
    }
  }
}
