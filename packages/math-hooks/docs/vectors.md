## `@react-vertex/math-hooks - Vector Hooks`

React hooks for working with vectors in WebGL. The `math-hooks` package depends on [gl-matrix](http://glmatrix.net/docs/module-mat4.html).  The return values are always instances from that library.

##### Install via npm:
```js
npm install @react-vertex/math-hooks
```

##### Importing:

```js
import {
  useVector2,
  useVector3,
  useVector4,
} from '@react-vertex/math-hooks'
```
#### `useVector2(x, y, configure?)` => `vector`

React hook to create a vector with x and y values set.  If either value changes the hook will return a **new vector**.  It does not mutate the existing. You can do further initial configuration using the `configure` param.

###### Arguments:

`x`: a number for the x value.

`y`: a number for the y value.

`configure (optional)`: Function to configure the instance before being returned. Changes to this parameter will not cause the hook to update, so you can provide an in-line function. 

###### Returns:

`vector`: returns an instance of a [gl-matrix vec2](http://glmatrix.net/docs/module-vec2.html)

###### Example Usage:

```js
import { useVector2 } from '@react-vertex/math-hooks'

...
  const xy = useVector2(100, 200)
...
```

#### `useVector3(x, y, z, configure?)` => `vector`

React hook to create a vector with x, y, and z values set.  If any value (x, y or z) changes the hook will return a **new vector**.  It does not mutate the existing. You can do further initial configuration using the `configure` param.

###### Arguments:

`x`: a number for the x value.

`y`: a number for the y value.

`z`: a number for the z value.

`configure (optional)`: Function to configure the instance before being returned. Changes to this parameter will not cause the hook to update, so you can provide an in-line function. 

###### Returns:

`vector`: returns an instance of a [gl-matrix vec3](http://glmatrix.net/docs/module-vec3.html)

###### Example Usage:

```js
import { useVector3 } from '@react-vertex/math-hooks'

...
  const position = useVector3(100, 0, 0)
...
```

#### `useVector4(x, y, z, w, configure?)` => `vector`

React hook to create a vector with x, y, z and w values set.  If any value (x, y, z or w) changes the hook will return a **new vector**.  It does not mutate the existing. You can do further initial configuration using the `configure` param.

###### Arguments:

`x`: a number for the x value.

`y`: a number for the y value.

`z`: a number for the z value.

`w`: a number for the z value.

`configure (optional)`: Function to configure the instance before being returned. Changes to this parameter will not cause the hook to update, so you can provide an in-line function. 

###### Returns:

`vector`: returns an instance of a [gl-matrix vec4](http://glmatrix.net/docs/module-vec4.html)

###### Example Usage:

```js
import { useVector4 } from '@react-vertex/math-hooks'

...
  const color = useVector4(1, 0, 0, 1)
...
```
