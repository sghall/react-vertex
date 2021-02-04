import { createContext } from 'react'

import { SceneNode } from './sceneGraph'

export default createContext<{ scene?: SceneNode }>({})
