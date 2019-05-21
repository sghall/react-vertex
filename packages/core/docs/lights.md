## `@react-vertex/core - Light Hooks`

React hooks for working with lights in React Vertex.

##### Install via npm:
```js
npm install @react-vertex/core
```

##### Importing:

```js
import {
  usePointLight,
  usePointLightCount,
  usePointLightUniforms,
} from '@react-vertex/core'
```

#### `usePointLight(color?, position?)` => `undefined`

React hook to add a point light to a React Vertex scene.

###### Arguments:

`color (optional)`: An array of length 3 for the light color (defaults to \[1, 1, 1\]).

`position (optional)`: An array of length 3 for the light position (defaults to \[0, 0, 0\]).

###### Returns:

`undefined`: This hook has no return value.

###### Example Usage:

```js
import { useVector3 } from '@react-vertex/math-hooks'
import { usePointLight } from '@react-vertex/core'

...
  const lightColor = useVector3(1, 1, 1)
  const lightPosition = useVector3(0, 0, 100)

  usePointLight(lightColor, ligthPosition)
...
```

#### `usePointLightCount(vertSource, fragSource)` => `[updatedVert, updatedFrag]`

React hook to inject the number of point lights into shaders.  This hook will update if the number changes.  Add the string `<<NUM_POINT_LIGHTS>>` in your shaders to use this hook.  It will ONLY change the first instance of the string.

###### Arguments:

`vertSource`: String source for the vert shader.

`fragSource`: String source for the frag shader.

###### Returns:

`[updatedVert, updatedFrag]`: An array with the updated shaders.

###### Example Usage:

```js
import {
  useProgram,
  useWebGLContext,
  usePointLightCount,
  usePointLightUniforms,
} from '@react-vertex/core'

...
  const gl = useWebGLContext()
  const [vertShader, fragShader] = usePointLightCount(vert, frag)
  const program = useProgram(gl, vertShader, fragShader)

  usePointLightUniforms(gl, program)
...
```

#### `usePointLightUniforms(gl, program)` => `undefined`

React hook to set the point light uniforms in a WebGL program.  This hook will update if the values change. You need to add the uniforms `pointLd` (light colors) and `pointLp` (light positions) to your shaders.

In your shader:
```
  const int NUM_POINT_LIGHTS = <<NUM_POINT_LIGHTS>>;

  uniform vec3 pointLd[NUM_POINT_LIGHTS];
  uniform vec3 pointLp[NUM_POINT_LIGHTS];
```

###### Arguments:

`gl`: A WebGL context.  You can call `useWebGLContext` to get the active context. 

`program`: A WebGL program.

###### Returns:

`undefined`: This hook has no return value.

###### Example Usage:

```js
import {
  useProgram,
  useWebGLContext,
  usePointLightCount,
  usePointLightUniforms,
} from '@react-vertex/core'

...
  const gl = useWebGLContext()
  const [vertShader, fragShader] = usePointLightCount(vert, frag)
  const program = useProgram(gl, vertShader, fragShader)

  usePointLightUniforms(gl, program)
...
```
