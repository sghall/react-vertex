## `@react-vertex/core - Uniform Hooks`

React hooks for working with WebGL uniforms. More info on [WebGL uniforms on MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform).

##### Install via npm:
```js
npm install @react-vertex/core
```

##### Importing:

```js
import {
  useUniformSampler2d,

  useUniform1f,
  useUniform1fv, 
  useUniform1i,  
  useUniform1iv,

  useUniform2f,
  useUniform2fv,
  useUniform2i,
  useUniform2iv,
  
  useUniform3f,
  useUniform3fv,
  useUniform3i,
  useUniform3iv,
  
  useUniform4f,
  useUniform4fv,
  useUniform4i,
  useUniform4iv,
  
  useUniformMatrix2fv,
  useUniformMatrix3fv,
  useUniformMatrix4fv,
} from '@react-vertex/core'
```

#### `useUniformSampler2d(gl, program, name, texture)` => `uniformLocation`

React hook for setting up a sampler uniform to make a texture available in your shader.

###### Arguments:

`gl`: A WebGL context.  You can call `useWebGLContext` to get the active context. 

`program`: The [WebGLProgram](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram) you want to attach the uniform to.

`name`: String name of the uniform as used in the shaders for the supplied program.

`texture`: a [WebGLTexture](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) to bind to.

###### Returns:

`uniformLocation`: The location of the uniform. See more on [WebGLUniformLocation](https://developer.mozilla.org/en-US/docs/Web/API/WebGLUniformLocation).

###### Example Usage:
```js
import { useWebGLContext, useProgram, useTexture2d, useUniformSampler2d } from '@react-vertex/core'
import tilesDiffUrl from 'static/textures/tiles_diff.png'

...
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)

  const [texDiff] = useTexture2d(gl, tilesDiffUrl)
  useUniformSampler2d(gl, program, 'texDiff', texDiff)
...

```

#### `useUniform[1234][fi]v(gl, program, name, value, ...)` => `uniformLocation`

React hooks for WebGL vector, float and integer uniforms. These hooks will update the uniform when the value changes.

###### Arguments:

`gl`: A WebGL context.  You can call `useWebGLContext` to get the active context. 

`program`: The [WebGLProgram](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram) you want to attach the uniform to.

`name`: String name of the uniform as used in the shaders for the supplied program.

`value(s)`: value(s) for the uniform.  You can use regular JavaScript arrays for those that accept arrays.

###### Returns:

`uniformLocation`: The location of the uniform. See more on [WebGLUniformLocation](https://developer.mozilla.org/en-US/docs/Web/API/WebGLUniformLocation).

###### Example Usage:
```js
import { useWebGLContext, useProgram, ... } from '@react-vertex/core'

...
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)

  // glsl: uniform float name;
  useUniform1f(gl, program, 'name', 40.5)
  useUniform1fv(gl, program, 'name', [40.5])

  // glsl: uniform int name;
  useUniform1i(gl, program, 'name', 100)
  useUniform1iv(gl, program, 'name', [100])

  // glsl: uniform vec2 name; 
  useUniform2f(gl, program, 'name', 40.5, 50.5)
  useUniform2fv(gl, program, 'name', [40.5, 50.5])
  useUniform2i(gl, program, 'name', 100, 200)
  useUniform2iv(gl, program, 'name', [100, 200])

  // glsl: uniform vec3 name; 
  useUniform3f(gl, program, 'name', 40.5, 50.5, 60.5)
  useUniform3fv(gl, program, 'name', [40.5, 50.5, 60.5])
  useUniform3i(gl, program, 'name', 100, 200, 300)
  useUniform3iv(gl, program, 'name', [100, 200, 300])

  // glsl: uniform vec4 name; 
  useUniform4f(gl, program, 'name', 40.5, 50.5, 60.5, 70.5)
  useUniform4fv(gl, program, 'name', [40.5, 50.5, 60.5, 70.5])
  useUniform4i(gl, program, 'name', 100, 200, 300, 400)
  useUniform4iv(gl, program, 'name', [100, 200, 300, 400])
...

```

#### `useUniformMatrix[234]fv(program, name, value)` => `uniformLocation`

React hooks for WebGL matrix uniforms. These hooks will update the uniform when the value changes.

###### Arguments:

`gl`: A WebGL context.  You can call `useWebGLContext` to get the active context. 

`program`: The [WebGLProgram](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram) you want to attach the uniform to.

`name`: String name of the uniform as used in the shaders for the supplied program.

`value`: The matrix value for the uniform.

###### Returns:

`uniformLocation`: The location of the uniform. See more on [WebGLUniformLocation](https://developer.mozilla.org/en-US/docs/Web/API/WebGLUniformLocation).

###### Example Usage:
```js
import { useIdentityMatrix } from '@react-vertex/math-hooks'
import { useWebGLContext, useProgram, useUniformMatrix4fv } from '@react-vertex/core'

...
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)

  const model = useIdentityMatrix()
  useUniformMatrix4fv(gl, program, 'uModel', model)
...

```