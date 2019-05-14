## `@react-vertex/math-hooks - Matrix Hooks`

React hooks for working with matrices in WebGL.  The `math-hooks` package depends on [gl-matrix](http://glmatrix.net/docs/module-mat4.html).  The return values are always instances from that library.

##### Install via npm:
```js
npm install @react-vertex/math-hooks
```

##### Importing:

```js
import {
  useIdentityMatrix,
  useInvertedMatrix,
  usePerspectiveMatrix,
} from '@react-vertex/math-hooks'
```

#### `useIdentityMatrix(px?, py?, pz?, configure?)` => `matrix`

React hook to create a new identity matrix. You can set the initial position via parameters and do further initial configuration using the `configure` param.

###### Arguments:

`px (optional)`: A number for the x position (defaults to 0).

`py (optional)`: A number for the y position (defaults to 0).

`pz (optional)`: A number for the z position (defaults to 0).

`configure (optional)`: Function to configure the instance before being returned. Changes to this parameter will not cause the hook to update, so you can provide an in-line function. 

###### Returns:

`matrix`: Returns an instance of a [gl-matrix mat4](http://glmatrix.net/docs/module-mat4.html)

###### Example Usage:

```js
import { useIdentityMatrix } from '@react-vertex/math-hooks'

...
  const model = useIdentityMatrix(0, 20, 0)
...
```

#### `useInvertedMatrix(px?, py?, pz?, configure?)` => `matrix`

React hook that returns an inverted matrix. This is largely useful for creating a static camera view. You can set the initial position via parameters and do further initial configuration using the `configure` param.

###### Arguments:

`px (optional)`: A number for the x position (defaults to 0).

`py (optional)`: A number for the y position (defaults to 0).

`pz (optional)`: A number for the z position (defaults to 0).

`configure (optional)`: Function to configure the instance before being returned. Changes to this parameter will not cause the hook to update, so you can provide an in-line function. 

###### Returns:

`matrix`: Returns an instance of a [gl-matrix mat4](http://glmatrix.net/docs/module-mat4.html)

###### Example Usage:

```js
import { useInvertedMatrix } from '@react-vertex/math-hooks'

...
  const view = useInvertedMatrix(0, 0, 20)
...
```
#### `usePerspectiveMatrix(fov, aspect, near?, far?, configure?)` => `matrix`

React hook to create a perspective projection matrix with the given field of view.

###### Arguments:

`fov`: Number defining the field of view in **degrees** (not radians).

`aspect`: Number defining the aspect ratio.

`near (optional)`: Number for the camera frustum near plane (defaults to 1).

`far (optional)`: Number for the camera frustum far plane (defaults to 1000).

`configure (optional)`: Function to configure the instance before being returned. Changes to this parameter will not cause the hook to update, so you can provide an in-line function. 

###### Returns:

`matrix`: returns an instance of a [gl-matrix mat4](http://glmatrix.net/docs/module-mat4.html)

###### Example Usage:

```js
import { usePerspectiveMatrix } from '@react-vertex/math-hooks'

...
  const projection = usePerspectiveMatrix(55, canvas.width / canvas.height, 0.1, 5000)
...
```