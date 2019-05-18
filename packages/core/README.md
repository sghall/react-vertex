## `@react-vertex/core`

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/sghall/react-vertex/blob/master/packages/core/LICENSE)
[![npm version](https://img.shields.io/npm/v/@react-vertex/core.svg)](https://www.npmjs.com/package/@react-vertex/core)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/@react-vertex/core)](https://bundlephobia.com/result?p=@react-vertex/core)

### [Documentation and Examples](https://react-vertex.com)

React Vertex core.

##### Install via npm:
```js
npm install @react-vertex/core
```

##### Importing:

```js
import {
  Canvas,
  useRender,
  useCanvas,
  useCanvasSize,
  useWebGLContext,
} from '@react-vertex/core'
```

#### `<Canvas />`

React component for creating a React Vertex component tree.  Renders a canvas element into the DOM.  The children of this component have to be valid React Vertex elements.

###### Props:

`width`: Number for the canvas width.

`height`: Number for the canvas height.

`antialias (optional)`: Boolean for using antialiasing (defaults to false).

`renderOnUpdate (optional)`: Boolean (defaults to false).

`renderOnResize (optional)`: Boolean (defaults to true).

`clearColor (optional)`: Array for clear color for scene (defaults to \[0, 0, 0, 1\]).

`canvasStyle (optional)`: Object containing styles for canvas element.

`canvasClass (optional)`: String class to be applied to canvas.

`extensions (optional)`: Array of string WebGL extensions to be loaded.

`contextAttrs (optional)`: Object containing context attributes.

###### Example Usage:

```js
import React, { useRef, useState } from 'react'
import { Canvas } from '@react-vertex/core'
import { useMeasure } from '@react-vertex/dom-hooks'
import { convertHex } from '@react-vertex/color-hooks'
import Scene from './Scene'

const clearColor = convertHex('#323334')

function Example() {
  const container = useRef()
  const { width } = useMeasure(container)

  return (
    <div ref={container}>
      <Canvas
        antialias
        width={width}
        height={width}
        clearColor={clearColor}
      >
        <Scene />
      </Canvas>
    </div>
  )
}

export default Example
```

#### Elements

Inside of a `<Canvas />` component you are no longer building an HTML document. Instead, a React Vertex scene is built of four primary elements: `<camera>`, `<group>`, `<material>` and `<geometry>`. You use the elements to build up the WebGL state used by the renderer.

At its most simple, a scene would look like:
```html
  <camera>
    <material>
      <geometry />
    </material>
  </camera>
```

#### <camera>

The `<camera>` elements defines the view and projection for downstream elements.

###### Props:

`view`:  A matrix instance of [gl-matrix mat4](http://glmatrix.net/docs/module-mat4.html). 

`projection`:  A matrix instance of [gl-matrix mat4](http://glmatrix.net/docs/module-mat4.html).

###### Example Usage:
```js
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import { useCanvasSize } from '@react-vertex/core'

function Scene() {
  const { width, height } = useCanvasSize()

  const camera = useOrbitCamera(55, width / height, 1, 5000)
  useOrbitControls(camera)

  ...

  return (
    <camera view={camera.view} projection={camera.projection}>
      ...
    </camera>
  )
```
#### <material>

The `<material>` element defines the WebGL program used to render downstream geometries.

###### Props:

`program`: A [WebGLProgram](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram). The program should have its uniforms set.  The renderer will handle setting `viewMatrix`, `modelMatrix` and `projectionMatrix` uniforms and setting attributes provided by geometry nodes.

###### Example Usage:
```js
import React from 'react'
import PropTypes from 'prop-types'
import { useHex } from '@react-vertex/color-hooks'
import { useSphereElements } from '@react-vertex/geometry-hooks'
import { useBasicProgram } from '@react-vertex/material-hooks'

function Light({ lightPosition }) {
  const sphere = useSphereElements(0.75, 10, 10)
  const diffuse = useHex('#ffa500', true)
  const program = useBasicProgram(diffuse)

  return (
    <material program={program}>
      <geometry position={lightPosition} {...sphere} />
    </material>
  )
}

Light.propTypes = {
  lightPosition: PropTypes.array.isRequired,
}

export default Light
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
