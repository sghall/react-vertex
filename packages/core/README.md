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

`program`: A [WebGLProgram](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram). The renderer will handle setting `viewMatrix`, `modelMatrix` and `projectionMatrix` uniforms and setting attributes provided by geometry nodes.

###### Example Usage:
```js
import React from 'react'
import { useHex } from '@react-vertex/color-hooks'
import { useSphereElements } from '@react-vertex/geometry-hooks'
import { useBasicProgram } from '@react-vertex/material-hooks'

function Example() {
  const sphere = useSphereElements(0.75, 10, 10)
  const diffuse = useHex('#ffa500', true)
  const program = useBasicProgram(diffuse)

  return (
    <material program={program}>
      <geometry {...sphere} />
    </material>
  )
}

export default Example
```

#### <geometry>
#### <instancedgeometry>

The `<geometry>` element defines the attributes and drawing parameters for a WebGL geometry in React Vertex.

###### Props:

`index (optional)`: WebGL buffer with the indices for the geometry. You can create a buffer using `useStaticBuffer`. You only need to set this if you are using `drawElements` i.e. you are drawing an indexed geometry.

`attributes`: Object of attribute functions returned from `useAttribute`.  The keys of the object should be the names of the attributes used in the shader program.

`position (optional)`: Array or Vector3 for the geometry position. You cannot mutate the position.  If you want to update the position you need to provide a new array or Vector3.

`rotation (optional)`: Array or Vector3 for the geometry rotation. You cannot mutate the rotation.  If you want to update the rotation you need to provide a new array or Vector3.

`scale (optional)`: Array or Vector3 for the geometry scale. You cannot mutate the scale.  If you want to update the scale you need to provide a new array or Vector3.

`drawElements (optional)`: Object of options for drawing an indexed geometry. The command follows the signature of the [drawElements function in WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements).  The object can specify the `mode` (defaults to 'TRIANGLES'), `count` (no default), `type` (defaults to 'UNSIGNED_SHORT') and `offset` (defaults to 0) e.g. `{ mode: 'LINES', count: 36 }`.  See the mode list below for all mode options.

`drawArrays (optional)`: Object of options for drawing an unindexed geometry. The command follows the signature of the [drawArrays function in WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays).  The object can specify the `mode` (defaults to 'TRIANGLES'), `count` (no default) and `first` (defaults to 0) e.g. `{ mode: 'LINES', count: 36 }`.  See the mode list below for all mode options.

| Mode             | Equivalent        |
| -----------------|-------------------|
| 'TRIANGLES'      | gl.TRIANGLES      |
| 'LINES'          | gl.LINES          |
| 'POINTS'         | gl.POINTS         |
| 'LINE_STRIP'     | gl.LINE_STRIP     |
| 'LINE_LOOP'      | gl.LINE_LOOP      |
| 'TRIANGLE_STRIP' | gl.TRIANGLE_STRIP |
| 'TRIANGLE_FAN'   | gl.TRIANGLE_FAN   |

###### Example Usage:
```js
import React from 'react'
import { useVector3 } from '@react-vertex/math-hooks'
import { useBoxElements } from '@react-vertex/geometry-hooks'

const PI = Math.PI

function Boxes() {
  const boxElements = useBoxElements(10, 10, 10)

  const r1 = useVector3(PI / 4, PI, 0)
  const r2 = useVector3(0, PI, PI / 4)

  const p1 = useVector3(10, 0, 0)
  const p2 = useVector3(20, 0, 0)
  const p3 = useVector3(30, 0, 0)
  const p4 = useVector3(40, 0, 0)

  return (
    <group rotation={r1}>
      <geometry rotation={r2} position={p1} {...boxElements} />
      <geometry rotation={r2} position={p2} {...boxElements} />
      <geometry rotation={r2} position={p3} {...boxElements} />
      <geometry rotation={r2} position={p4} {...boxElements} />
    </group>
  )
}
```

To get more control over the geometry buffers and attributes you can use some of the more low-level hooks from the `@react-vertex/core`:
```js
import React, { Fragment, useMemo } from 'react'
import { useVector3 } from '@react-vertex/math-hooks'
import { useBoxGeometry } from '@react-vertex/geometry-hooks'
import { useWebGLContext, useStaticBuffer, useAttribute } from '@react-vertex/core'

function Boxes() {
  const geometry = useBoxGeometry(10, 10, 10)

  // this is what "useBoxElements" does internally...
  const gl = useWebGLContext()

  const positionBuffer = useStaticBuffer(gl, geometry.vertices, false, 'F32')
  const position = useAttribute(gl, 3, positionBuffer)

  const normalBuffer = useStaticBuffer(gl, geometry.normals, false, 'F32')
  const normal = useAttribute(gl, 3, normalBuffer)

  const uvBuffer = useStaticBuffer(gl, geometry.uvs, false, 'F32')
  const uv = useAttribute(gl, 2, uvBuffer)

  const indexBuffer = useStaticBuffer(gl, geometry.indices, true, 'U16')

  const boxElements = useMemo(
    () => ({
      index: indexBuffer,
      attributes: { position, normal, uv },
      drawElements: { mode: 'TRIANGLES', count: geometry.indices.length },
    }),
    [indexBuffer, geometry.indices.length, position, normal, uv],
  )

  const p1 = useVector3(10, 0, 0)
  const p2 = useVector3(20, 0, 0)
  const p3 = useVector3(30, 0, 0)
  const p4 = useVector3(40, 0, 0)

  return (
    <Fragment>
      <geometry position={p1} {...boxElements} />
      <geometry position={p2} {...boxElements} />
      <geometry position={p3} {...boxElements} />
      <geometry position={p4} {...boxElements} />
    </Fragment>
  )
}
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
