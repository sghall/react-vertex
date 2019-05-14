import Node from './GraphNode'

export const isInstancedNode = Symbol('isInstancedNode')
export const instancedExt = 'ANGLE_instanced_arrays'

export class InstancedNode extends Node {
  constructor() {
    super()
  }

  [isInstancedNode] = true
  attributes = {}

  applyProps(nextprops, prevProps = {}) {
    this.applyMatrixProps(nextprops, prevProps)
    this.index = nextprops.index
    this.attributes = nextprops.attributes
    this.drawElements = nextprops.drawElements
  }
}
