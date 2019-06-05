## `@react-vertex/core - Shader Hooks`

React hooks for working with WebGL programs and shaders. More info on [WebGL Programs](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram) and [WebGL shaders](https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader).

##### Install via npm:
```js
npm install @react-vertex/core
```

##### Importing:

```js
import {
  useShader,
  useProgram,
  useProgramUniforms,
} from '@react-vertex/core'
```

#### `useProgram(gl, vertSource, fragSource)` => `WebGLProgram`

React hook for creating a WebGL program.  It uses `useShader` internally so you likely only need to use this hook to setup a basic program. More info on [WebGL Programs](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram).  The hook will warn on compile errors and provide debug information.  The program will also be deleted automatically when the containing component unmounts to conserve resources.

**note:** If you put the string `<<FLOAT_PRECISION>>` in your shaders the max precision for the device will replace that string as `highp`, `mediump` or `lowp`.

###### Arguments:

`gl`: A WebGL context.  You can call `useWebGLContext` to get the active context. 

`vertSource`: A string containing the vertex shader source or a compiled `WebGLShader` (see `useShader` below).

`fragSource`: A string containing the fragment shader source or a compiled `WebGLShader` (see `useShader` below).

###### Returns:

`program`: A [WebGLProgram](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram).

###### Example Usage:

```js
import {
  useProgram
  useWebGLContext,
} from '@react-vertex/core'

const vert = `
  precision <<FLOAT_PRECISION>> float;

  attribute vec3 position;

  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

const frag = `
  precision <<FLOAT_PRECISION>> float;

  uniform vec3 uKd;

  void main() {
    gl_FragColor = vec4(uKd, 1.0);
  }
`

...
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)
...
```

#### `useProgramUniforms(gl, program)` => `object`

React hook to get an object with the locations for a program's uniforms.

###### Arguments:

`gl`: A WebGL context.  You can call `useWebGLContext` to get the active context. 

`program`: The WebGL program you want the unforms for.

###### Returns:

`object`: An object with the uniform names as keys and their locations as values.

###### Example Usage:

```js
import {
  useProgram,
  useWebGLContext,
  useProgramUniforms,
} from '@react-vertex/core'
import vert from './vert'
import frag from './frag'

...
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)
  const uniforms = useProgramUniforms(gl, program)
...
```

#### `useShader(gl, source, isVertShader?)` => `WebGLShader`

React hook for creating a WebGL shader. This is used internally by `useProgram` so you might not need it. This is useful if you want to compile your shaders higher up in your app. The hook will warn on compile errors and provide debug information.

**note:** If you put the string `<<FLOAT_PRECISION>>` in your shaders the max precision for the device will replace that string as `highp`, `mediump` or `lowp`.

###### Arguments:

`gl`: A WebGL context.  You can call `useWebGLContext` to get the active context. 

`source`: A string containing the shader source.

`isVertShader (optional)`: Boolean value that defualts to false.

###### Returns:

`shader`: A [WebGLShader](https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader).

###### Example Usage:

```js
import { useWebGLContext, useShader, useProgram } from '@react-vertex/core'

const vert = `
  precision <<FLOAT_PRECISION>> float;

  attribute vec3 position;

  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

const frag = `
  precision <<FLOAT_PRECISION>> float;

  uniform vec3 uKd;

  void main() {
    gl_FragColor = vec4(uKd, 1.0);
  }
`

...
  const gl = useWebGLContext()
  const vertShader = useShader(gl, vert, true) // compile shaders somewhere
  const fragShader = useShader(gl, frag, false)
...

// Then use them...
...
  const program = useProgram(gl, vertShader, fragShader)
...
```
