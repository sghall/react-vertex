## `@react-vertex/core - Attribute Hooks`

React hooks for working with WebGL attributes. More info on [WebGL atrributes on MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer).

##### Install via npm:
```js
npm install @react-vertex/core
```

##### Importing:

```js
import {
  useAttribute,
} from '@react-vertex/core'
```

#### `useAttribute(gl, size, buffer, getOptions?)` => `function`

React hook for WebGL attributes.

###### Arguments:

`gl`: A WebGL context.  You can call `useWebGLContext` to get the active context. 

`size`: An integer indicating the number of components per vertex attribute. Must be 1, 2, 3, or 4.

`buffer`: A WebGL buffer. You can use hooks from `buffer-hooks` to create it.

`getOptions`: A function that will be called with the context (gl) that returns an object with the options you wish to override.

###### Valid keys in object returned by getOptions:
  - `target` defualts to gl.ARRAY_BUFFER
  - `type` defaults to gl.FLOAT
  - `normalized` defaults to false
  - `stride` defualts to 0
  - `offset` defaults to 0

###### Returns:

`function`: Returns a function that can be called with an attribute location.  This is used by the renderer to load the attribute at the correct time.

###### Example Usage:

```js
import {
  useWebGLContext,
  useProgram,
  useStaticBuffer,
  useAttribute
} from '@react-vertex/core'

const attrOptions = gl => ({
  type: gl.SHORT,
  stride: 20,
  offset: 16,
})

...
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)

  const positionBuffer = useStaticBuffer(gl, positions, false, 'F32')
  useAttribute(gl, 3, positionBuffer, attrOptions)
...

```
