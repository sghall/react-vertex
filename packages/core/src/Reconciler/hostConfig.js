import {
  unstable_scheduleCallback as schedulePassiveEffects,
  unstable_cancelCallback as cancelPassiveEffects,
} from 'scheduler'
import warn from 'warning'
import {
  GroupNode,
  CameraNode,
  MaterialNode,
  GeometryNode,
  InstancedNode,
} from '../sceneGraph'

const NO_CONTEXT = true
const NOOP = () => {}

const addChild = (parentInstance, child) => {
  if (typeof child === 'string') {
    warn(false, 'React Vertex does not support text nodes.')
    return
  }

  parentInstance.add(child)
}

export default {
  schedulePassiveEffects,
  cancelPassiveEffects,
  now: Date.now,
  prepareForCommit: NOOP,
  resetAfterCommit: NOOP,
  getRootHostContext: () => NO_CONTEXT,
  getChildHostContext: () => NO_CONTEXT,
  shouldSetTextContent: (type, props) => {
    return (
      typeof props.children === 'string' || typeof props.children === 'number'
    )
  },
  createInstance: (type, props, internalInstanceHandle) => {
    let instance

    switch (type) {
      case 'group':
        instance = new GroupNode()
        instance.root = internalInstanceHandle
        break
      case 'camera':
        instance = new CameraNode()
        instance.root = internalInstanceHandle
        break
      case 'material':
        instance = new MaterialNode()
        instance.root = internalInstanceHandle
        break
      case 'geometry':
        instance = new GeometryNode()
        instance.root = internalInstanceHandle
        break
      case 'instancedgeometry':
        instance = new InstancedNode()
        instance.root = internalInstanceHandle
        break
    }

    warn(instance, 'React Vertex does not support the type "%s"', type)

    instance.applyProps(props)

    return instance
  },
  createTextInstance: text => text,
  resetTextContent: NOOP,
  getPublicInstance: instance => instance,
  appendChildToContainer: addChild,
  removeChildFromContainer: (parentInstance, child) => {
    parentInstance.remove(child)
  },
  appendInitialChild: addChild,
  appendChild: addChild,
  removeChild: (parentInstance, child) => {
    parentInstance.remove(child)
  },
  insertBefore: addChild,
  insertInContainerBefore: addChild,
  finalizeInitialChildren: NOOP,
  supportsMutation: true,
  prepareUpdate: () => true,
  commitUpdate: (instance, payload, type, oldProps, newProps) => {
    instance.applyProps(newProps, oldProps)
  },
}
