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
  useBasicSolid,
  usePhongSolidProgram,
  useSolidLambert,
} from '@react-vertex/material-hooks'
```

##### Naming convention

This package uses a naming convention based loosely on the convention used by the [.mtl format](https://en.wikipedia.org/wiki/Wavefront_.obj_file).

| Name   | Description        |
| -------|--------------------|
|  kd    | Material Diffuse   |
|  ka    | Material Ambient   |
|  na    | Ambient Strength   |
|  ks    | Material Specular  |
|  ns    | Specular Strength  |
|  mapKd | Diffuse Map        |
|  mapKs | Specular Map       |

#### `useBasicSolid(kd?)` => `WebGLProgram`

Hook for basic program.  This program only has diffuse color and does not react to lights in the scene.

###### Arguments:

`kd`: An array of length 3 for the diffuse color (default to white \[1, 1, 1\]). 

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
  const basicProgram = useBasicSolid(diffuse)
...

```
