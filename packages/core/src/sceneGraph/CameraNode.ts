import { mat4 } from 'gl-matrix'

import GraphNode from './GraphNode'
import { CameraNodeProps } from '../types'

export const isCameraNode = Symbol('isCameraNode')

export class CameraNode extends GraphNode {
  constructor() {
    super()

    this.view = mat4.create()
    this.projection = mat4.create()
  }

  [isCameraNode] = true

  camera = null
  view: mat4
  projection: mat4

  applyProps(nextprops: CameraNodeProps, prevProps: CameraNodeProps = {}) {
    this.applyMatrixProps(nextprops, prevProps)

    if (nextprops.view) {
      this.view = nextprops.view
    }
    if (nextprops.projection) {
      this.projection = nextprops.projection
    }
  }
}
