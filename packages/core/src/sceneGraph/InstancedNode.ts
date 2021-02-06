import Node from './GraphNode'

import {
  InstancedNodeProps,
  GeometryAttributes,
  InstancedDrawElements,
} from '../types'

export const isInstancedNode = Symbol('isInstancedNode')
export const instancedExt = 'ANGLE_instanced_arrays'

export class InstancedNode extends Node {
  index: number
  attributes: GeometryAttributes
  drawElements?: InstancedDrawElements

  constructor() {
    super()

    this.index = 0
    this.attributes = {}
  }

  [isInstancedNode] = true

  applyProps(
    nextprops: InstancedNodeProps,
    prevProps: InstancedNodeProps = {},
  ) {
    this.applyMatrixProps(nextprops, prevProps)

    if (nextprops.index !== undefined) {
      this.index = nextprops.index
    }

    if (nextprops.attributes !== undefined) {
      this.attributes = nextprops.attributes
    }

    this.drawElements = nextprops.drawElements
  }
}
