# `@react-vertex/geometry-hooks`

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/sghall/react-vertex/blob/master/packages/geometry-hooks/LICENSE)
[![npm version](https://img.shields.io/npm/v/@react-vertex/geometry-hooks.svg)](https://www.npmjs.com/package/@react-vertex/geometry-hooks)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/@react-vertex/geometry-hooks)](https://bundlephobia.com/result?p=@react-vertex/geometry-hooks)

### [Documentation and Examples](https://react-vertex.com)

React hooks for working with geometries in React Vertex.  This package contains ports of the code from THREE.js that generates the indices, vertices, normals and uvs for various geometry types.

##### Install via npm:
```js
npm install @react-vertex/geometry-hooks
```

#### Importing:

```js
import {
  boxGeometry,
  useBoxGeometry,
  useBoxElements,

  circleGeometry,
  useCircleGeometry,
  useCircleElements,

  cylinderGeometry,
  useCylinderGeometry,
  useCylinderElements,

  planeGeometry,
  usePlaneGeometry,
  usePlaneElements,
  
  sphereGeometry,
  useSphereGeometry,
  useSphereElements,
  
  torusGeometry,
  useTorusGeometry,
  useTorusElements,
} from '@react-vertex/geometry-hooks'
```

#### `boxGeometry(width?, height?, depth?, wCount?, hCount?, dCount?)` => `object`
#### `useBoxGeometry(width?, height?, depth?, wCount?, hCount?, dCount?)` => `object`
#### `useBoxElements(width?, height?, depth?, wCount?, hCount?, dCount?)` => `object`

React hooks and a pure function for working with box geometries. `boxGeometry` is a regular pure function (not a hook) that returns the raw indices, vertices, normals and uvs.  `useBoxGeometry` returns the same thing as `boxGeometry` but can be used as a hook to memoize the generation of the data.  `useBoxElements` is a convenience hook that will create all the buffers and attributes needed to draw the geometry into the scene. 

###### Arguments:

`width (optional)`: A number for the width of the box (defaults to 1).

`height (optional)`: A number for the height of the box (defaults to 1).

`depth (optional)`: A number for the depth of the box (defaults to 1).

`wCount (optional)`: Number of segments for the width (defaults to 1).

`hCount (optional)`: Number of segments for the height (defaults to 1).

`dCount (optional)`: Number of segments for the depth (defaults to 1).

###### Return Values:

`boxGeometry` => `{ indices, vertices, normals, uvs }`

`useBoxGeometry` => `{ indices, vertices, normals, uvs }`

`useBoxElements` => `{ index, count, attributes, drawElements }`

###### Example Usage:

```js
import React, { Fragment } from 'react'
import { useVector3 } from '@react-vertex/math-hooks'
import { useBoxElements } from '@react-vertex/geometry-hooks'

function Boxes() {
  const boxElements = useBoxElements(10, 10, 10)

  const p1 = useVector3(10, 0, 0)
  const p2 = useVector3(20, 0, 0)
  const p3 = useVector3(30, 0, 0)
  const p4 = useVector3(40, 0, 0)

  return (
    <Fragment>
      <geometry position={p1} {...boxElements} />
      <geometry position={p2} {...boxElements} />
      <geometry position={p3} {...boxElements} />
      <geometry position={p4} {...boxElements} />
    </Fragment>
  )
}
```

```js
import React, { Fragment, useMemo } from 'react'
import { useVector3 } from '@react-vertex/math-hooks'
import { useBoxGeometry } from '@react-vertex/geometry-hooks'
import { useWebGLContext, useStaticBuffer, useAttribute } from '@react-vertex/core'

// NOTE: This is exactly equivalent to the above example.
// More advanced users can see here how to access the attributes, buffers, etc.
// All the geometries work in exactly the same way.

function Boxes() {
  const geometry = useBoxGeometry(10, 10, 10)

  // this is what "useBoxElements" does internally...
  const gl = useWebGLContext()

  const positionBuffer = useStaticBuffer(gl, geometry.vertices, false, 'F32')
  const position = useAttribute(gl, 3, positionBuffer)

  const normalBuffer = useStaticBuffer(gl, geometry.normals, false, 'F32')
  const normal = useAttribute(gl, 3, normalBuffer)

  const uvBuffer = useStaticBuffer(gl, geometry.uvs, false, 'F32')
  const uv = useAttribute(gl, 2, uvBuffer)

  const indexBuffer = useStaticBuffer(gl, geometry.indices, true, 'U16')

  const boxElements = useMemo(
    () => ({
      index: indexBuffer,
      attributes: { position, normal, uv },
      drawElements: { mode: 'TRIANGLES', count: geometry.indices.length },
    }),
    [indexBuffer, geometry.indices.length, position, normal, uv],
  )

  const p1 = useVector3(10, 0, 0)
  const p2 = useVector3(20, 0, 0)
  const p3 = useVector3(30, 0, 0)
  const p4 = useVector3(40, 0, 0)

  return (
    <Fragment>
      <geometry position={p1} {...boxElements} />
      <geometry position={p2} {...boxElements} />
      <geometry position={p3} {...boxElements} />
      <geometry position={p4} {...boxElements} />
    </Fragment>
  )
}
```

#### `circleGeometry(radius?, segments?, thetaStart?, thetaLength?)` => `object`
#### `useCircleGeometry(radius?, segments?, thetaStart?, thetaLength?)` => `object`
#### `useCircleElements(radius?, segments?, thetaStart?, thetaLength?)` => `object`

React hooks and a pure function for working with circle geometries. `circleGeometry` is a regular pure function (not a hook) that returns the raw indices, vertices, normals and uvs.  `useCircleGeometry` returns the same thing as `circleGeometry` but can be used as a hook to memoize the generation of the data.  `useCircleElements` is a convenience hook that will create all the buffers and attributes needed to draw the geometry into the scene. 

###### Arguments:

`radius (optional)`: A number for the radius of the circle (defaults to 1).

`segments (optional)`: Number of segments (defaults to 8).

`thetaStart (optional)`: Start angle for first segment (defaults to 0).

`thetaLength (optional)`: Angle amount to be generated (defaults to Math.PI * 2).

###### Return Values:

`circleGeometry` => `{ indices, vertices, normals, uvs }`

`useCircleGeometry` => `{ indices, vertices, normals, uvs }`

`useCircleElements` => `{ index, count, attributes, drawElements }`

###### Example Usage:

`(see the examples for box geometry)`

#### `cylinderGeometry(radiusTop?, radiusBottom?, height?, radialSegments?, heightSegments?, openEnded?, thetaStart?, thetaLength?)` => `object`
#### `useCylinderGeometry(radiusTop?, radiusBottom?, height?, radialSegments?, heightSegments?, openEnded?, thetaStart?, thetaLength?)` => `object`
#### `useCylinderElements(radiusTop?, radiusBottom?, height?, radialSegments?, heightSegments?, openEnded?, thetaStart?, thetaLength?)` => `object`

React hooks and a pure function for working with cylinder geometries. `cylinderGeometry` is a regular pure function (not a hook) that returns the raw indices, vertices, normals and uvs.  `useCylinderGeometry` returns the same thing as `cylinderGeometry` but can be used as a hook to memoize the generation of the data.  `useCylinderElements` is a convenience hook that will create all the buffers and attributes needed to draw the geometry into the scene. 

###### Arguments:

`radiusTop (optional)`: A number for the top radius of the cylinder (defaults to 1).

`radiusBottom (optional)`: A number for the bottom radius of the cylinder (defaults to 1).

`height (optional)`: A number for the height of the cylinder (defaults to 1).

`radialSegments (optional)`: Number of radial segments (defaults to 8).

`heightSegments (optional)`: Number of height segments (defaults to 1).

`openEnded (optional)`: Boolean for not including caps on ends (defaults to false).

`thetaStart (optional)`: Start angle for first segment (defaults to 0).

`thetaLength (optional)`: Angle amount to be generated (defaults to Math.PI * 2).

###### Return Values:

`cylinderGeometry` => `{ indices, vertices, normals, uvs }`

`useCylinderGeometry` => `{ indices, vertices, normals, uvs }`

`useCylinderElements` => `{ index, count, attributes, drawElements }`

###### Example Usage:

`(see the examples for box geometry)`

#### `planeGeometry(width?, height?, widthSegments?, heightSegments?)` => `object`
#### `usePlaneGeometry(width?, height?, widthSegments?, heightSegments?)` => `object`
#### `usePlaneElements(width?, height?, widthSegments?, heightSegments?)` => `object`

React hooks and a pure function for working with plane geometries. `planeGeometry` is a regular pure function (not a hook) that returns the raw indices, vertices, normals and uvs.  `usePlaneGeometry` returns the same thing as `planeGeometry` but can be used as a hook to memoize the generation of the data.  `usePlaneElements` is a convenience hook that will create all the buffers and attributes needed to draw the geometry into the scene. 

###### Arguments:

`width (optional)`: A number for the width of the plane (defaults to 1).

`height (optional)`: A number for the height of the plane (defaults to 1).

`widthSegments (optional)`: Number of width segments (defaults to 1).

`heightSegments (optional)`: Number of height segments (defaults to 1).

###### Return Values:

`planeGeometry` => `{ indices, vertices, normals, uvs }`

`usePlaneGeometry` => `{ indices, vertices, normals, uvs }`

`usePlaneElements` => `{ index, count, attributes, drawElements }`

###### Example Usage:

`(see the examples for box geometry)`

#### `sphereGeometry(radius?, widthSegments?, heightSegments?, phiStart?, phiLength?, thetaStart?, thetaLength?)` => `object`
#### `useSphereGeometry(radius?, widthSegments?, heightSegments?, phiStart?, phiLength?, thetaStart?, thetaLength?)` => `object`
#### `useSphereElements(radius?, widthSegments?, heightSegments?, phiStart?, phiLength?, thetaStart?, thetaLength?)` => `object`

React hooks and a pure function for working with sphere geometries. `sphereGeometry` is a regular pure function (not a hook) that returns the raw indices, vertices, normals and uvs.  `useSphereGeometry` returns the same thing as `sphereGeometry` but can be used as a hook to memoize the generation of the data.  `useSphereElements` is a convenience hook that will create all the buffers and attributes needed to draw the geometry into the scene. 

###### Arguments:

`radius (optional)`: A number for the radius of the sphere (defaults to 1).

`widthSegments (optional)`: Number of width segments (defaults to 8).

`heightSegments (optional)`: Number of height segments (defaults to 6).

`phiStart (optional)`: Horizontal start angle for first segment (defaults to 0).

`phiLength (optional)`: Horizontal angle amount to be generated (defaults to Math.PI * 2).

`thetaStart (optional)`: Vertical start angle for first segment (defaults to 0).

`thetaLength (optional)`: Vertical angle amount to be generated (defaults to Math.PI).

###### Return Values:

`sphereGeometry` => `{ indices, vertices, normals, uvs }`

`useSphereGeometry` => `{ indices, vertices, normals, uvs }`

`useSphereElements` => `{ index, count, attributes, drawElements }`

###### Example Usage:

`(see the examples for box geometry)`

#### `torusGeometry(radius?, tube?, radialSegments?, tubularSegments?, arc?)` => `object`
#### `useTorusGeometry(radius?, tube?, radialSegments?, tubularSegments?, arc?)` => `object`
#### `useTorusElements(radius?, tube?, radialSegments?, tubularSegments?, arc?)` => `object`

React hooks and a pure function for working with torus geometries. `torusGeometry` is a regular pure function (not a hook) that returns the raw indices, vertices, normals and uvs.  `useTorusGeometry` returns the same thing as `torusGeometry` but can be used as a hook to memoize the generation of the data.  `useTorusElements` is a convenience hook that will create all the buffers and attributes needed to draw the geometry into the scene. 

###### Arguments:

`radius (optional)`: A number for the radius of the torus (defaults to 1).

`tube (optional)`: A number for the radius of the tube of the torus (defaults to 0.4).

`radialSegments (optional)`: Number of radial segments (defaults to 8).

`tubularSegments (optional)`: Number of tubular segments (defaults to 6).

`arc (optional)`: Angular amount to be generated (defaults to Math.PI * 2).

###### Return Values:

`torusGeometry` => `{ indices, vertices, normals, uvs }`

`useTorusGeometry` => `{ indices, vertices, normals, uvs }`

`useTorusElements` => `{ index, count, attributes, drawElements }`

###### Example Usage:

`(see the examples for box geometry)`