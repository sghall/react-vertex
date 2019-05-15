import GraphNode from './GraphNode'

export const isCameraNode = Symbol('isCameraNode')

export class CameraNode extends GraphNode {
  constructor() {
    super()
  }

  [isCameraNode] = true

  camera = null

  applyProps(nextprops, prevProps = {}) {
    this.applyMatrixProps(nextprops, prevProps)
    this.view = nextprops.view
    this.projection = nextprops.projection
  }
}
