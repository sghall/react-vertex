## `@react-vertex/core - Core Hooks`

Core hooks for creating a WebGL scene with React Vertex.

##### Install via npm:
```js
npm install @react-vertex/core
```

##### Importing:

```js
import {
  useRender,
  useCanvas,
  useCanvasSize,
  useWebGLContext,
} from '@react-vertex/core'
```

#### `useRender()` => `function`

React hook that returns a function to render the scene. You can use this hook from anywhere inside a React Vertex component tree.

###### Arguments:
 - None.

###### Returns:

`function`: The render function.

###### Example Usage:

```js
import React, { useEffect } from 'react'
import { timer } from 'd3-timer'
import { useRender } from '@react-vertex/core'

function Scene() {
  const renderScene = useRender()
  
  useEffect(() => {
    const timerLoop = timer(renderScene)
    return () => timerLoop.stop()
  }, [renderScene])

  ....
```

#### `useCanvas()` => `DOM Element`

React hook that returns the canvas DOM element. You can use this hook from anywhere inside a React Vertex component tree. **Note: You shouldn't use this to get the canvas size. The dedicated useCanvasSize hook should be used for that.**

###### Arguments:
 - None.

###### Returns:

`canvas`: The canvas DOM element.

#### `useCanvasSize()` => `object`

React hook for the current width and height of the canvas.  This will update when the dimensions change. You can use this hook from anywhere inside a React Vertex component tree.

###### Arguments:
 - None.

###### Returns:

`object`: An object with the current width and height e.g. `{ width: 100, height: 100 }`.

###### Example Usage:

```js
import { useCanvasSize } from '@react-vertex/core'
import { useOrbitCamera } from '@react-vertex/orbit-camera'

function Scene() {
  const { width, height } = useCanvasSize()
  const camera = useOrbitCamera(55, width / height, 1, 5000)

  ...
```

#### `useWebGLContext()` => `WebGLContext`

React hook for the current WebGL context. You can use this hook from anywhere inside a React Vertex component tree.

###### Arguments:
 - None.

###### Returns:

`WebGLContext`: The WebGL context.

###### Example Usage:

```js
import { useWebGLContext, useStaticBuffer } from '@react-vertex/core'

function Scene() {
  const gl = useWebGLContext()
  const positionBuffer = useStaticBuffer(gl, positions, false, 'F32')
  ...
```
