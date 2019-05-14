import GraphNode from './GraphNode'

export const isMaterialNode = Symbol('isMaterialNode')

export class MaterialNode extends GraphNode {
  constructor() {
    super()
  }

  [isMaterialNode] = true
  program = null

  applyProps(nextprops, prevProps = {}) {
    this.applyMatrixProps(nextprops, prevProps)
    this.program = nextprops.program
  }
}
