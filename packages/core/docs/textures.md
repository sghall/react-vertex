## `@react-vertex/core - Texture Hooks`

React hooks for working with WebGL textures. More info on [using textures in WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL).

##### Install via npm:
```js
npm install @react-vertex/core
```

##### Importing:

```js
import {
  useTexture2d,
  useDataTexture,
  useTextureUnit,
} from '@react-vertex/core'
```

#### `useTexture2d(url, getOptions?)` => \[`WebGLTexture`, `isLoaded`\]

React hook for creating a 2d WebGL texture from an image. It returns a texture immediately with a placeholder pixel and updates it when the image loads.

###### Arguments:

`url`: The URL of the texture image to load.

`getOptions (optional)`: A function that will be called with the context (gl) that returns an object with the options you wish to override. The hook does not update when this param changes so you can use an inline function.

###### Valid keys in object returned by getOptions:
  - `format` defualts to gl.RGBA
  - `crossOrigin` defaults to `anonymous` (this is for the image request)
  - `mipMaps`Boolean defaults to true. More on [mipmaps](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/generateMipmap).
  - `type` defaults to gl.UNSIGNED_BYTE
  - `wrap` defaults to null (sets both wrapS and wrapT)
  - `wrapS` defaults to gl.REPEAT (will be overridden by `wrap` if used)
  - `wrapT` defaults to gl.REPEAT (will be overridden by `wrap` if used)
  - `minMag` defaults to null (sets both minFilter and magFilter)
  - `minFilter` defaults to gl.NEAREST_MIPMAP_LINEAR (will be overridden by `minMag` if used)
  - `magFilter` defaults to gl.LINEAR (will be overridden by `minMag` if used)
  - `placeholder` defaults to a black pixel (new Uint8Array(\[0, 0, 0, 1\]))

###### Returns:

\[`texture`, `isLoaded`\] : An array with a [WebGLTexture](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) as the first item and a boolean `isLoaded` indicating whether the full image has loaded yet.

###### Example Usage:

```js
import {
  useWebGLContext,
  useProgram,
  useTexture2d,
  useUniformSampler2d
} from '@react-vertex/core'

...
  const gl = useWebGLContext()
  const program = useProgram(gl, vert, frag)

  const [texture] = useTexture2d(imageUrl)
  useUniformSampler2d(gl, program, 'texDiff', texture)
...

```

#### `useDataTexture(gl, data, width, height, getOptions?)` => `WebGLTexture`

React hook for 2d data texture.

###### Arguments:

`gl`: A WebGL context.  You can call `useWebGLContext` to get the active context.

`data`: Null or data array.

`width`: Number for the width.

`height`: Number for the height.

`getOptions (optional)`: A function that will be called with the context (gl) that returns the options to be applied to the texture.  The hook does not update when this param changes so you can use an inline function.

###### Valid keys in object returned by getOptions:
  - `format` defualts to gl.RGBA
  - `type` defaults to gl.FLOAT
  - `wrap` defaults to null (sets both wrapS and wrapT)
  - `wrapS` defaults to gl.CLAMP_TO_EDGE (will be overridden by `wrap` if used)
  - `wrapT` defaults to gl.CLAMP_TO_EDGE (will be overridden by `wrap` if used)
  - `minMag` defaults to null (sets both minFilter and magFilter)
  - `minFilter` defaults to gl.NEAREST (will be overridden by `minMag` if used)
  - `magFilter` defaults to gl.NEAREST (will be overridden by `minMag` if used)

###### Returns:

`texture` : A [WebGLTexture](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture).

###### Example Usage:

```js
import {
  useWebGLContext,
  useProgram,
  useDataTexture,
} from '@react-vertex/core'

...
  const gl = useWebGLContext()
  const texture = useDataTexture(gl, 256, 256)
...

```

#### `useTextureUnit()` => `TextureUnit`

React hook to get a texture unit in React Vertex.  There are only limited number of texture units (slots) available on a device (some mobile devices will have just 8).  Callling this hook will claim a texture unit a prevent clashes with other components that need texture units.  The hook will automatically release the texture unit when the caller unmounts.  This is done internally for you when you use `useUniformSampler2d` (see uniforms section).

###### Arguments:

- None.

###### Returns:

`TextureUnit` : A number.

###### Example Usage:

```js
import {
  useTextureUnit,
} from '@react-vertex/core'

...
  const tex1 = useTextureUnit()
  const tex2 = useTextureUnit()
...

```
