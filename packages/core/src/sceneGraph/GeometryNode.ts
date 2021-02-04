import Node from './GraphNode'

import {
  GeometryNodeProps,
  GeometryAttributes,
  GeometryDrawArrays,
  GeometryDrawElements,
} from '../types'

export const isGeometryNode = Symbol('isGeometryNode')

export class GeometryNode extends Node {
  index: number
  attributes: GeometryAttributes
  drawArrays?: GeometryDrawArrays
  drawElements?: GeometryDrawElements

  constructor() {
    super()

    this.index = 0
    this.attributes = {}
  }

  [isGeometryNode] = true

  applyProps(nextprops: GeometryNodeProps, prevProps: GeometryNodeProps = {}) {
    this.applyMatrixProps(nextprops, prevProps)

    if (nextprops.index !== undefined) {
      this.index = nextprops.index
    }

    if (nextprops.attributes !== undefined) {
      this.attributes = nextprops.attributes
    }

    this.drawArrays = nextprops.drawArrays
    this.drawElements = nextprops.drawElements
  }
}
