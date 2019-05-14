# `@react-vertex/gl-context`

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/sghall/react-vertex/blob/master/packages/gl-context/LICENSE)
[![npm version](https://img.shields.io/npm/v/@react-vertex/gl-context.svg)](https://www.npmjs.com/package/@react-vertex/gl-context)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/@react-vertex/gl-context)](https://bundlephobia.com/result?p=@react-vertex/gl-context)

### [Documentation and Examples](https://react-vertex.com)

A React component to render a canvas and create a WebGL context.  It uses the render prop pattern.  For SSR this component will not render its children. **Note: it's not required to use this component to use the other hook packages.**

##### Install via npm:
```js
npm install @react-vertex/gl-context
```

#### Importing:

```js
import GlContext from '@react-vertex/gl-context'
```

##### Props:

`width`: Number for width of canvas element (defaults to 1).

`height`: Number for height of canvas element (defaults to 1).

`antialias (optional)`: Boolean to turn on antialiasing (defaults to false).

`canvasClass (optional)`: String class to be added to the canvas.

`canvasStyle (optional)`: An object of styles to be applied to the canvas.

`extensions (optional)`: An array of strings identifying the [WebGL extensions](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Using_Extensions) you want loaded in the context.

`contextAttrs (optional)`: An object of context attributes you want applied.

`children`: A function that accepts the context (`gl`) and an array of the extension return values (if using any extensions are being used) defaults to an empty array.

##### Example Usage:

```js
import React, { useRef } from 'react'
import GLContext from '@react-vertex/gl-context'
import { useMeasure } from '@react-vertex/dom-hooks'

function Example() {
  const container = useRef()
  const { width } = useMeasure(container)

  return (
    <div ref={container}>
      <GLContext
        width={width}
        height={width}
        canvasStyle={{
          borderRadius: 4
        }}
      >
        {(gl, extensions) => (
          <Scene gl={gl} extensions={extensions} />
        )}
      </GLContext>
    </div>
  )
}

export default Example
```
