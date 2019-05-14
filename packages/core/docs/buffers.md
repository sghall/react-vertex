## `@react-vertex/core - Buffer Hooks`

React hooks for working with WebGL buffers. Efficiently manage static, stream, and dynamic buffers for use in WebGL programs.

##### Install via npm:
```js
npm install @react-vertex/core
```

##### Importing:

```js
import {
  useStaticBuffer,
  useStreamBuffer,
  useDynamicBuffer,
} from '@react-vertex/core'
```

#### `useStaticBuffer(gl, data, isIndex?, format?)` => `WebGLBuffer`

React hook to create a static WebGL buffer. You can also, optionally, convert a JS array to a typed array by specifying a format. Use this type of buffer for cases where the contents of the buffer are likely to be used often and not change often. See [docs on WebGL buffers](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData) for more.

###### Arguments:

`gl`: A WebGL context.  You can call `useWebGLContext` to get the active context. 

`data`: An array. If you pass a regular array, use `format` to convert to a typed array.

`isIndex (optional)`: Boolean indicating if you want to create an index buffer or not. Defaults to false.

`format (optional)`: A string format e.g. 'F32'.  See formats list below.

###### Returns:

`buffer`: A [WebGLBuffer](https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer) instance.

###### Example Usage:

```js
import {
  useWebGLContext,
  useStaticBuffer,
} from '@react-vertex/core'

...
  const gl = useWebGLContext()
  const positionBuffer = useStaticBuffer(gl, positions, false, 'F32')
  const indexBuffer = useStaticBuffer(gl, indices, true, 'U16')
...

```

#### `useStreamBuffer(gl, data, isIndex?, format?)` => `WebGLBuffer`

React hook to create a WebGL stream buffer. You can also, optionally, convert a JS array to a typed array by specifying a format. Use this type of buffer for cases where the contents of the buffer are likely to not be used often. See [docs on WebGL buffers](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData) for more.

###### Arguments:

`gl`: A WebGL context.  You can call `useWebGLContext` to get the active context. 

`data`: An array. If you pass a regular array, use `format` to convert to a typed array.

`isIndex (optional)`: Boolean indicating if you want to create an index buffer or not. Defaults to false.

`format (optional)`: A string format e.g. 'F32'.  See formats list below.

###### Returns:

`buffer`: A [WebGLBuffer](https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer) instance.

###### Example Usage:

```js
import {
  useWebGLContext,
  useStreamBuffer,
} from '@react-vertex/core'

...
  const gl = useWebGLContext()
  const positionBuffer = useStreamBuffer(gl, positions, false, 'F32')
  const indexBuffer = useStaticBuffer(gl, indices, true, 'U16')
...

```

#### `useDynamicBuffer(gl, data, isIndex?, format?)` => `WebGLBuffer`

React hook to create a dynamic WebGL buffer. You can also, optionally, convert a JS array to a typed array by specifying a format.  Use this type of buffer for cases where the contents of the buffer are likely to be used often and change often. See [docs on WebGL buffers](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData) for more.

###### Arguments:

`gl`: A WebGL context.  You can call `useWebGLContext` to get the active context. 

`data`: An array. If you pass a regular array, use `format` to convert to a typed array.

`isIndex (optional)`: Boolean indicating if you want to create an index buffer or not. Defaults to false.

`format (optional)`: A string format e.g. 'F32'.  See formats list below.

###### Returns:

`buffer`: A [WebGLBuffer](https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer) instance. 

###### Example Usage:

```js
import {
  useWebGLContext,
  useDynamicBuffer,
} from '@react-vertex/core'

...
  const gl = useWebGLContext()
  const positionBuffer = useDynamicBuffer(gl, positions, false, 'F32')
  const indexBuffer = useStaticBuffer(gl, indices, true, 'U16')
...

```

## Valid Formats

[Typed Arrays on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays#Typed_array_views)

| Format | Type         | Range                            |
| -------|--------------|----------------------------------|
| 'U8'   | Uint8Array   | -128 to 127                      |
| 'U16'  | Uint16Array  | -32,768 to 32,767                |
| 'U32'  | Uint32Array  | -2,147,483,648 to 2,147,483,647  |
| 'I8'   | Int8Array    | -128 to 127                      |
| 'I16'  | Int16Array   | -32,768 to 32,767                |
| 'I32'  | Int32Array   | -2,147,483,648 to 2,147,483,647  |
| 'F32'  | Float32Array | 1.2x10^-38 to 3.4x10^38          |
