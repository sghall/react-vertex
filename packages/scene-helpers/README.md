## `@react-vertex/scene-helpers`

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/sghall/react-vertex/blob/master/packages/scene-helpers/LICENSE)
[![npm version](https://img.shields.io/npm/v/@react-vertex/scene-helpers.svg)](https://www.npmjs.com/package/@react-vertex/scene-helpers)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/@react-vertex/scene-helpers)](https://bundlephobia.com/result?p=@react-vertex/scene-helpers)

### [Documentation and Examples](https://react-vertex.com)

##### Install via npm:
```js
npm install @react-vertex/scene-helpers
```

##### Importing:

```js
import {
  useValueSlider,
  useColorPicker,
  useSelectControl,
  AxesHelper,
  useAxesHelperProgram,
  useAxesHelperGeometry,
  useAxesHelperElements,
} from '@react-vertex/scene-helpers'
```

#### `useValueSlider(label, value, min, max, step)` => `number`

React hooks to create a value slider in a React Vertex component tree. You can use this hook anywhere in the component tree and it will be added to the list of controls in the upper right of the screen.  The order of controls across different parts of the tree is determined by render order and is not customizable.

###### Arguments:

`label`: String label for the slider.

`value`: Number for the initial value of the slider.

`min`: Number for the min value of the slider.

`max`: Number for the max value of the slider.

`step`: Number for step value of the slider.

###### Return Values:

`number`: The value of the slider.  This updates as the slider is moved.

###### Example Usage:

```js
import React, { memo, useMemo } from 'react'
import { useVector3 } from '@react-vertex/math-hooks'
import { useBoxElements } from '@react-vertex/geometry-hooks'
import { useValueSlider } from '@react-vertex/scene-helpers'

function Example() {
  const boxElements = useBoxElements(10, 10, 10)

  const scaleX = useValueSlider('Geometry Scale X:', 1, 1, 5, 0.1)
  const scaleY = useValueSlider('Geometry Scale Y:', 1, 1, 5, 0.1)
  const scaleZ = useValueSlider('Geometry Scale Z:', 1, 1, 5, 0.1)

  const scale = useVector3(scaleX, scaleY, scaleZ)

  return (
    <geometry scale={scale} {..boxElements} />
  )
}
```

#### `useColorPicker(label, hexColor, noAlpha?)` => `array`

React hooks to create a color slider in a React Vertex component tree. You can use this hook anywhere in the component tree and it will be added to the list of controls in the upper right of the screen.  The order of controls across different parts of the tree is determined by render order and is not customizable.

###### Arguments:

`label`: String label for the slider.

`hexColor`: String hex color for initial color.

`noAlpha`: Boolean for whether the alpha value should be in the returned array (defaults to false).

###### Return Values:

`array`: Array of values between 0 and 1.  Array is 4 elements by default and 3 elements if no alpha is set to true.

###### Example Usage:

```js
import React from 'react'
import { useCanvasSize } from '@react-vertex/core'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import { useBasicSolid } from '@react-vertex/material-hooks'
import { useColorPicker } from '@react-vertex/scene-helpers'

function Example() {
  const { width, height } = useCanvasSize()

  const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
    c.setPosition([0, 0, 25])
  })
  useOrbitControls(camera)

  const diffuse = useColorPicker('Wireframe Color: ', '#A9E6E3', true)
  const program = useBasicSolid(diffuse)

  return (
    <camera view={camera.view} projection={camera.projection}>
      <material program={program}>
        ...
      </material>
    </camera>
  )
}
```

#### `useSelectControl(label, options)` => `array`

React hooks to create a select control in a React Vertex component tree. You can use this hook anywhere in the component tree and it will be added to the list of controls in the upper right of the screen.  The order of controls across different parts of the tree is determined by render order and is not customizable.

###### Arguments:

`label`: String label for the slider.

`options`: An array of `{ label, value }` objects.

###### Return Values:

`value`: The selected value.  The first item in the array will be returned on the initial render.

###### Example Usage:

```js
import React from 'react'
import { useCanvasSize } from '@react-vertex/core'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import { useBasicSolid } from '@react-vertex/material-hooks'
import { useColorPicker } from '@react-vertex/scene-helpers'

function Example() {

  const showWireframe  = useSelectControl('Show Wireframe?', [
    { value: true, label: 'True' },
    { value: false, label: 'False' },
  ])

  const Material = useSelectControl('Material: ', [
    { value: PhongTextured, label: 'Phong Textured' },
    { value: PhongSolid, label: 'Phong Solid' },
  ])
  ...
```

#### `AxesHelper`

React Vertex component that renders x, y and z axes.

###### Props:

`size (optional)`: Number for the length of the axes (defaults to 100).

###### Example Usage:

```js
import React from 'react'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import { useCanvasSize } from '@react-vertex/core'
import { AxesHelper } from '@react-vertex/scene-helpers'

function Scene({ showAxes }) {
  const { width, height } = useCanvasSize()

  const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
    c.setPosition([0, 0, 30])
  })
  useOrbitControls(camera)

  return (
    <camera view={camera.view} projection={camera.projection}>
      <AxesHelper size={10} />
    </camera>
  )
}
```

#### `useAxesHelperProgram()` => `WebGLProgram`

React hook for working with Axes Helper program.

###### Arguments:
- None.

###### Return Values:

`program`: A WebGL program that can be applied to axes helper geometry.

#### `useAxesHelperGeometry(size?)` => `object`
#### `useAxesHelperElements(size?)` => `object`

React hooks for working with Axes Helper.

###### Arguments:

`size`: Number for the length of the axes (defaults to 100).

###### Return Values:

`useAxesHelperGeometry` => `{ colors, positions }`

`useAxesHelperElements` => `{ index, count, attributes, drawElements }`
