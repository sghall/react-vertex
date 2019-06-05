## `@react-vertex/orbit-camera`

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/sghall/react-vertex/blob/master/packages/orbit-camera/LICENSE)
[![npm version](https://img.shields.io/npm/v/@react-vertex/orbit-camera.svg)](https://www.npmjs.com/package/@react-vertex/orbit-camera)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/@react-vertex/orbit-camera)](https://bundlephobia.com/result?p=@react-vertex/orbit-camera)

### [Documentation and Examples](https://react-vertex.com)

React hooks for basic orbit style perspective camera and controls.

##### Install via npm:
```js
npm install @react-vertex/orbit-camera
```

##### Importing:

```js
import {
  useOrbitCamera,
  useOrbitControls,
} from '@react-vertex/orbit-camera'
```

#### `useOrbitCamera(fov, aspect, near?, far?, configure?)` => `camera`

React hook for creating an orbit camera.

###### Arguments:

`fov`: Number defining the field of view in **degrees** (not radians).

`aspect`: Number defining the aspect ratio.

`near (optional)`: Number for the camera frustum near plane (defaults to 1).

`far (optional)`: Number for the camera frustum far plane (defaults to 1000).

`configure (optional)`: Function to configure the instance before being returned. Changes to this parameter will not cause the hook to update, so you can provide an in-line function. 

###### Returns:

`camera`: The camera instance.

###### Example Usage:

```js
import { useCanvasSize } from '@react-vertex/core'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'

...
  const { width, height } = useCanvasSize()
  
  const camera = useOrbitCamera(55, width / height, 1, 1000, c => {
    c.setPosition([0, 0, 25])
  })
  useOrbitControls(camera)
...
```

- Set `userRotate` to false to disable rotation in x and y (orbit camera only rotates in x and y).
- Set `userRotateX` to false to disable only rotation in x.
- Set `userRotateY` to false to disable only rotation in y.
- Set `userDolly` to false to disable dolly function.

```
  const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
    c.setPosition([0, 0, 500])
    c.userRotate = false
  })
```

#### `useOrbitControls(camera, configure?)` => `controls`

React hook to setup camera controls.

###### Arguments:

`camera`: An instance of the orbit camera.

`configure (optional)`: Function to configure the instance before being returned. Changes to this parameter will not cause the hook to update, so you can provide an in-line function. 

###### Returns:

`controls`: The controls instance.

###### Example Usage:

```js
import { useCanvasSize } from '@react-vertex/core'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'

...
  const { width, height } = useCanvasSize()
  
  const camera = useOrbitCamera(55, width / height, 1, 1000, c => {
    c.setPosition([0, 0, 25])
  })
  useOrbitControls(camera)
...
