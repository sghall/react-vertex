# React Vertex

Hooks-based WebGL Library for React

**This library is experimental and has not been officially released. Expected to be stable by Summer of 2019.**

### [Documentation and Examples](https://react-vertex.com)

## Packages

### @react-vertex/core

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/sghall/react-vertex/blob/master/packages/core/LICENSE)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/@react-vertex/core)](https://bundlephobia.com/result?p=@react-vertex/core)
[![npm version](https://img.shields.io/npm/v/@react-vertex/core.svg)](https://www.npmjs.com/package/@react-vertex/core)

React components, renderer and hooks for WebGL scenes.

```npm install @react-vertex/core```

##### [Documentation for Core](https://react-vertex.com/docs-core-hooks/)

### @react-vertex/geometry-hooks

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/sghall/react-vertex/blob/master/packages/geometry-hooks/LICENSE)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/@react-vertex/geometry-hooks)](https://bundlephobia.com/result?p=@react-vertex/geometry-hooks)
[![npm version](https://img.shields.io/npm/v/@react-vertex/geometry-hooks.svg)](https://www.npmjs.com/package/@react-vertex/geometry-hooks)

React hooks for working with geometries in React Vertex. 

```npm install @react-vertex/geometry-hooks```

##### [Documentation for Geometry Hooks](https://react-vertex.com/docs-geometry-hooks/)

### @react-vertex/material-hooks

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/sghall/react-vertex/blob/master/packages/material-hooks/LICENSE)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/@react-vertex/material-hooks)](https://bundlephobia.com/result?p=@react-vertex/material-hooks)
[![npm version](https://img.shields.io/npm/v/@react-vertex/material-hooks.svg)](https://www.npmjs.com/package/@react-vertex/material-hooks)

React hooks for working with materials in React Vertex.

```npm install @react-vertex/material-hooks```

##### [Documentation for Material Hooks](https://react-vertex.com/docs-material-hooks/)

### @react-vertex/math-hooks

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/sghall/react-vertex/blob/master/packages/math-hooks/LICENSE)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/@react-vertex/math-hooks)](https://bundlephobia.com/result?p=@react-vertex/math-hooks)
[![npm version](https://img.shields.io/npm/v/@react-vertex/math-hooks.svg)](https://www.npmjs.com/package/@react-vertex/math-hooks)

React hooks for working with vectors and matrices in WebGL.

```npm install @react-vertex/math-hooks```

##### [Documentation for Math Hooks](https://react-vertex.com/docs-matrix-hooks/)

### @react-vertex/orbit-camera

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/sghall/react-vertex/blob/master/packages/orbit-camera/LICENSE)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/@react-vertex/orbit-camera)](https://bundlephobia.com/result?p=@react-vertex/orbit-camera)
[![npm version](https://img.shields.io/npm/v/@react-vertex/orbit-camera.svg)](https://www.npmjs.com/package/@react-vertex/orbit-camera)

React hooks for a basic orbit camera and controls.

```npm install @react-vertex/orbit-camera```

##### [Documentation for Orbit Camera](https://react-vertex.com/docs-orbit-camera/)

### @react-vertex/color-hooks

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/sghall/react-vertex/blob/master/packages/color-hooks/LICENSE)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/@react-vertex/color-hooks)](https://bundlephobia.com/result?p=@react-vertex/color-hooks)
[![npm version](https://img.shields.io/npm/v/@react-vertex/color-hooks.svg)](https://www.npmjs.com/package/@react-vertex/color-hooks)

Hooks and utility functions to convert colors to WebGL friendly formats.

```npm install @react-vertex/color-hooks```

#### [Documentation for Color Hooks](https://react-vertex.com/docs-color-hooks/)

## How does it work?

Inside of a `<Canvas />` component you are no longer building an HTML document. Instead, a React Vertex scene is built of four primary elements: `<camera>`, `<group>`, `<material>` and `<geometry>`. You use the elements to build up the WebGL state used by the renderer.

At its most simple, a scene would look like:
```html
  <camera>
    <material>
      <geometry />
    </material>
  </camera>
```

Or something like:
```html
  <camera>
    <group>
      <material>
        <group>
          <geometry />
          <geometry />
          <geometry />
        </group>
      </material>
      <material>
        <group>
          <material>
            <geometry />
          </material>
          <geometry />
          <geometry />
        </group>
      </material>
    </group>
  </camera>
```

Of course, you can create your own custom components to build up that document however you like:
```html
  <camera>
    <group>
      <Asteroids />
      <Robots />
      {showSharks ? (
        <group>
          <Shark weapon={laserBeam} />
          <Shark weapon={laserBeam} />
        </group>
      ) : null}
    </group>
    <SeaBass illTempered={false} />
  </camera>
```

### <camera>

The camera takes just two props that define the `view` (matrix) and the `projection` (matrix): 
```html
  <camera view={view} projection={projection}>
    <material>
      <geometry />
      <geometry />
      <geometry />
    </material>
  </camera>
```

The `view` and `projection` should be instances of [gl-matrix mat4](http://glmatrix.net/docs/module-mat4.html).  If you already know how to work with `gl-matrix` then you can use whatever method you like to keep those props up to date.  You can mutate the matrices and the changes will be reflected in the render.

For convenience you can use `@react-vertex/math-hooks` to create a static camera view:
```js
import {
  useInvertedMatrix,
  usePerspectiveMatrix,
} from '@react-vertex/math-hooks'

function Scene() {
  const view = useInvertedMatrix(0, 0, 50)
  const projection = usePerspectiveMatrix(35, 1.0, 0.1, 1000)

  ...

  return (
    <camera view={view} projection={projection}>
      ...
    </camera>
  )
```

Or use `@react-vertex/orbit-camera` to create a dynamic camera:
```js
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import { useCanvasSize } from '@react-vertex/core'

function Scene() {
  const { width, height } = useCanvasSize()

  const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
    c.setPosition([0, 0, 30])
  })
  useOrbitControls(camera)

  ...

  return (
    <camera view={camera.view} projection={camera.projection}>
      ...
    </camera>
  )
```

### <material>

Right now, the material nodes just take a single `program` prop.  The `program` is a WebGL program with its uniforms set.  The nearest `<camera>` ancestor will define the view and projection. The `viewMatrix` and `projectionMatrix` uniforms of the program shaders will be set by the renderer.  You can use `@react-vertex/material-hooks` for some common programs or look at the source to compose your own custom program hooks. The Phong and Lambert programs in `@react-vertex/material-hooks` make use of lights in the scene.

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






## Running the repo locally

```
git clone git@github.com:sghall/react-vertex.git
cd react-vertex
npm install && npm run dev

// You may need to bootstrap lerna as well
npx lerna bootstrap
```

## Adding a demo

First, note that the root of the repo is a nextjs app.  There's a `pages` folder and a `static` folder and so on.  There's a `babel.config.js` at the root of the repo that aliases the packages so you can use them directly from source in the demos.

### Steps:

1. Probably easiest to copy an existing demo in the `demos` folder and give it a new name (something short and sweet that is at least vaguely descriptive).  **Pro-tip:** Get the existing demo running at the new location and THEN add your demo code.

2. Add a page (copy an existing) to the `pages` folder using the convention `demo-my-demo.js` (this a static site with no dynamic pages that the reason for the "demo-" prefix). All of the code should be in the `demos` folder so someone can see the whole thing without hunting around and copy it to their environment etc. So just make a minimal page pointing to your demo...

```js
// inside pages/demo-my-demo.js

import MyDemo from 'demos/MyDemo'

export default MyDemo
```

3. Add your demo to `demosList` in the `docs/config.js` so it will appear on the sidebar menu.

4. Then (if you have already run ```npm install```) type ```npm run dev``` to start developing.