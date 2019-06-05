## `@react-vertex/core - Framebuffer Hooks`

React hooks for working with framebuffers in React Vertex.

##### Install via npm:
```js
npm install @react-vertex/core
```

##### Importing:

```js
import {
  useFBO,
  useDoubleFBO,
} from '@react-vertex/core'
```

#### `useFBO(gl, width, height, getTexOpts?)` => `{ fbo, tex, attach }`

React hook to create a framebuffer object (FBO).

###### Arguments:

`gl`: A WebGL context.  You can call `useWebGLContext` to get the active context. 

`width`: Number for the width of the internal data texture.

`height`: Number for the height of the internal data texture.

`getTexOpts (optional)`: A function that will be called with the context (gl) that returns the options to be applied to the internal data texture. This is passed directly to `useDataTexture` see the docs in textures for available options.

###### Returns:

`object`: An object with three properties `{ fbo, tex, attach }`: `fbo` is a refernce to the framebuffer, `tex` is a reference to the texture and attach is function for binding the texture.  The attach function takes a single texture unit (number) argument and binds the texture to the texture unit and then returns the texture unit.

###### Example Usage:

```js
import {
  useFBO,
  useTextureUnit,
  useWebGLContext,
} from '@react-vertex/core'

...
  const gl = useWebGLContext()
  const t1 = useTextureUnit()
  
  const colors = useFBO(gl, 256, 256)

  // render to the framebuffer
  gl.bindFramebuffer(gl.FRAMEBUFFER, colors.fbo)

  // set a texture uniform
  gl.uniform1i(location, colors.attach(t1))
...

```

#### `useDoubleFBO(gl, width, height, getTexOpts?)` => `{ read, write, swap }`

React hook to create a double framebuffer object. This is helpful when you want to swap between two framebuffer objects for reading and writing.

###### Arguments:

`gl`: A WebGL context.  You can call `useWebGLContext` to get the active context. 

`width`: Number for the width of the internal data textures.

`height`: Number for the height of the internal data textures.

`getTexOpts (optional)`: A function that will be called with the context (gl) that returns the options to be applied to the internal data textures. This is passed directly to `useDataTexture` see the docs in textures for available options.

###### Returns:

`object`: An object with three properties `{ read, write, swap }`: `read` is a getter for the current read FBO, `write` is a getter for the current write FBO and swap is function for swapping the read and write FBOs.  The swap function takes no arguments.

###### Example Usage:

```js
import {
  useDoubleFBO,
  useTextureUnit,
  useWebGLContext,
} from '@react-vertex/core'

...
  const gl = useWebGLContext()
  const t1 = useTextureUnit()
  
  const colors = useDoubleFBO(gl, 256, 256)

  // use texture from read
  gl.uniform1i(location, colors.read.attach(t1))

  // write result of render to write.fbo
  renderToBuffer(velocityDFBO.write.fbo)

  // swap the two FBOs
  colors.swap()
...

```
