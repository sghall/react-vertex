## `@react-vertex/material-hooks`

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/sghall/react-vertex/blob/master/packages/material-hooks/LICENSE)
[![npm version](https://img.shields.io/npm/v/@react-vertex/material-hooks.svg)](https://www.npmjs.com/package/@react-vertex/material-hooks)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/@react-vertex/material-hooks)](https://bundlephobia.com/result?p=@react-vertex/material-hooks)

### [Documentation and Examples](https://react-vertex.com)

React hooks for working with materials in React Vertex.

##### Install via npm:
```js
npm install @react-vertex/material-hooks
```

##### Importing:

```js
import {
  usePhongSolid,
  usePhongTextured,
  useBasicSolid,
  useBasicTextured,
  useLambertSolid,
  useLambertTextured,
} from '@react-vertex/material-hooks'
```

##### Naming convention

This package uses a naming convention based (loosely) on the convention used by the [.mtl format](https://en.wikipedia.org/wiki/Wavefront_.obj_file).

| Name   | Description        |
| -------|--------------------|
|  kd    | Material Diffuse   |
|  ka    | Material Ambient   |
|  na    | Ambient Strength   |
|  ks    | Material Specular  |
|  ns    | Specular Strength  |
|  mapKd | Diffuse Map        |
|  mapKs | Specular Map       |

#### `usePhongSolid(kd?, na?, ns?, ka?, ks?)` => `WebGLProgram`

Hook for Phong with a solid color. This program reacts to lights in the scene.

###### Arguments:

`kd (optional)`: An array of length 3 for the diffuse color (defaults to white \[1, 1, 1\]). 

`na (optional)`: Number for amount of ambient lighting should be between 0 and 1 (defaults to 0).

`ns (optional)`: Number for specular strength should be between 0 and 1000 (defaults to 500).

`ka (optional)`: An array of length 3 for the ambient color (defaults to white \[1, 1, 1\]).

`ks (optional)`: An array of length 3 for the specular color (defaults to grey \[0.6, 0.6, 0.6\]).

###### Returns:

`WebGLProgram`: A [WebGLProgram](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram) instance.

###### Required attributes:

Geometries using this program must set the following attributes:

- vec3 position
- vec3 normal

###### Example Usage:

```js
import { useHex } from '@react-vertex/color-hooks'
import { usePhongSolid } from '@react-vertex/material-hooks'

...
  const diffuse = useHex('#323334', true)
  const program = usePhongSolid(diffuse, 0.15)

  return (
    <material program={program}>
      ...
    </material>
  )
...
```

#### `usePhongTextured(mapKd, na?, ns?, ka?, ks?)` => `WebGLProgram`

Hook for Phong with texture colors. This program reacts to lights in the scene.

###### Arguments:

`mapKd`: A texture to be used for the material colors. 

`na (optional)`: Number for amount of ambient lighting should be between 0 and 1 (defaults to 0).

`ns (optional)`: Number for specular strength should be between 0 and 1000 (defaults to 500).

`ka (optional)`: An array of length 3 for the ambient color (defaults to white \[1, 1, 1\]).

`ks (optional)`: An array of length 3 for the specular color (defaults to grey \[0.6, 0.6, 0.6\]).

###### Returns:

`WebGLProgram`: A [WebGLProgram](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram) instance.

###### Required attributes:

Geometries using this program must set the following attributes:

- vec3 position
- vec3 normal
- vec2 uv

###### Example Usage:

```js
import { useTexture2d } from '@react-vertex/core'
import { usePhongTextured } from '@react-vertex/material-hooks'

...
  const [texture] = useTexture2d(textureUrl)
  const program = usePhongTextured(texture, 0.15)

  return (
    <material program={program}>
      ...
    </material>
  )
...
```

#### `useBasicSolid(kd?)` => `WebGLProgram`

Hook for basic program with a solid color.  This program does not react to lights in the scene.

###### Arguments:

`kd (optional)`: An array of length 3 for the diffuse color (default to white \[1, 1, 1\]). 

###### Returns:

`WebGLProgram`: A [WebGLProgram](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram) instance.

###### Required attributes:

Geometries using this program must set the following attributes:

- vec3 position

###### Example Usage:

```js
import { useHex } from '@react-vertex/color-hooks'
import { useBasicSolid } from '@react-vertex/material-hooks'

...
  const diffuse = useHex('#323334', true)
  const program = useBasicSolid(diffuse)

  return (
    <material program={program}>
      ...
    </material>
  )
...
```

#### `useBasicTextured(mapKd)` => `WebGLProgram`

Hook for basic program with texture colors.  This program does not react to lights in the scene.

###### Arguments:

`mapKd`: An array of length 3 for the diffuse color (default to white \[1, 1, 1\]). 

###### Returns:

`WebGLProgram`: A [WebGLProgram](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram) instance.

###### Required attributes:

Geometries using this program must set the following attributes:

- vec3 position
- vec2 uv

###### Example Usage:

```js
import { useTexture2d } from '@react-vertex/core'
import { useBasicTextured } from '@react-vertex/material-hooks'

...
  const [texture] = useTexture2d(textureUrl)
  const program = useBasicTextured(texture)

  return (
    <material program={program}>
      ...
    </material>
  )
...
```

#### `useLambertSolid(kd?, na?, ka?)` => `WebGLProgram`

Hook for Lambert with a solid color. This program reacts to lights in the scene.

###### Arguments:

`kd (optional)`: An array of length 3 for the diffuse color (defaults to white \[1, 1, 1\]). 

`na (optional)`: Number for amount of ambient lighting should be between 0 and 1 (defaults to 0).

`ka (optional)`: An array of length 3 for the ambient color (defaults to white \[1, 1, 1\]).

###### Returns:

`WebGLProgram`: A [WebGLProgram](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram) instance.

###### Required attributes:

Geometries using this program must set the following attributes:

- vec3 position
- vec3 normal

###### Example Usage:

```js
import { useHex } from '@react-vertex/color-hooks'
import { useLambertSolid } from '@react-vertex/material-hooks'

...
  const diffuse = useHex('#323334', true)
  const program = useLambertSolid(diffuse, 0.15)

  return (
    <material program={program}>
      ...
    </material>
  )
...
```

#### `useLambertTextured(mapKd, na?, ka?)` => `WebGLProgram`

Hook for Lambert with texture colors. This program reacts to lights in the scene.

###### Arguments:

`mapKd`: A texture to be used for the material colors. 

`na (optional)`: Number for amount of ambient lighting should be between 0 and 1 (defaults to 0).

`ka (optional)`: An array of length 3 for the ambient color (defaults to white \[1, 1, 1\]).

###### Returns:

`WebGLProgram`: A [WebGLProgram](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram) instance.

###### Required attributes:

Geometries using this program must set the following attributes:

- vec3 position
- vec3 normal
- vec2 uv

###### Example Usage:

```js
import { useTexture2d } from '@react-vertex/core'
import { useLambertTextured } from '@react-vertex/material-hooks'

...
  const [texture] = useTexture2d(textureUrl)
  const program = useLambertTextured(texture, 0.15)

  return (
    <material program={program}>
      ...
    </material>
  )
...
```