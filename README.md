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