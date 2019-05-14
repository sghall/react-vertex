import Node from './GraphNode'

export const isGeometryNode = Symbol('isGeometryNode')

export class GeometryNode extends Node {
  constructor() {
    super()
  }

  [isGeometryNode] = true
  attributes = {}

  applyProps(nextprops, prevProps = {}) {
    this.applyMatrixProps(nextprops, prevProps)
    this.index = nextprops.index
    this.attributes = nextprops.attributes
    this.drawArrays = nextprops.drawArrays
    this.drawElements = nextprops.drawElements
  }
}
