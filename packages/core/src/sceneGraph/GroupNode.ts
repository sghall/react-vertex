import GraphNode from './GraphNode'

import { MatrixProps } from '../types'

export const isGroupNode = Symbol('isGroupNode')

export class GroupNode extends GraphNode {
  constructor() {
    super()
  }

  [isGroupNode] = true

  applyProps(nextprops: MatrixProps, prevProps: MatrixProps = {}) {
    this.applyMatrixProps(nextprops, prevProps)
  }
}
