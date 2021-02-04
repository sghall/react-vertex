import GraphNode from './GraphNode'

import { MaterialNodeProps } from '../types'

export const isMaterialNode = Symbol('isMaterialNode')

export class MaterialNode extends GraphNode {
  constructor() {
    super()
  }

  [isMaterialNode] = true
  program: WebGLProgram | null = null

  applyProps(nextprops: MaterialNodeProps, prevProps: MaterialNodeProps = {}) {
    this.applyMatrixProps(nextprops, prevProps)

    if (nextprops.program) {
      this.program = nextprops.program
    }
  }
}
