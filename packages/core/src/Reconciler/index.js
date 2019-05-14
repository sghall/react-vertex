import Reconciler from 'react-reconciler'
import hostConfig from './hostConfig'

export * from '../sceneGraph'

const ReactVertexReconciler = Reconciler(hostConfig)

ReactVertexReconciler.injectIntoDevTools({
  findFiberByHostInstance: () => null,
  bundleType: process.env.REACT_ENV === 'development' ? 1 : 0,
  version: '16.8.6',
  rendererPackageName: 'react-vertex',
})

export default ReactVertexReconciler
