import GraphNode from './GraphNode'

export const isGroupNode = Symbol('isGroupNode')

export class GroupNode extends GraphNode {
  constructor() {
    super()
  }

  [isGroupNode] = true

  applyProps(nextprops, prevProps = {}) {
    this.applyMatrixProps(nextprops, prevProps)
  }
}
