# `@react-vertex/color-hooks`

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/sghall/react-vertex/blob/master/packages/color-hooks/LICENSE)
[![npm version](https://img.shields.io/npm/v/@react-vertex/color-hooks.svg)](https://www.npmjs.com/package/@react-vertex/color-hooks)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/@react-vertex/color-hooks)](https://bundlephobia.com/result?p=@react-vertex/color-hooks)

### [Documentation and Examples](https://react-vertex.com)

Hooks and utility functions for converting colors to WebGL friendly formats.

##### Install via npm:
```js
npm install @react-vertex/color-hooks
```

#### Importing:

```js
import {
  useHex,
  convertHex,
  useRgb,
  convertRgb,
} from '@react-vertex/color-hooks'
```

## `useHex(hex, noAlpha?)` => `Array`
## `convertHex(hex, noAlpha?)` => `Array`

Convert hex colors to WebGL friendly format. Exported as a hook (`useHex`) and a utility function (`convertHex`).

##### Arguments:

`hex`: String hex color.

`noAlpha (optional)`: Boolean indicating if you want the alpha value in the array.

##### Returns:

`array`: An array of numbers between 0 and 1.  A four element array by default and three elements if the `noAlpha` parameter is used.

##### Example Usage:

```js
import {
  useHex,
  convertHex,
} from '@react-vertex/color-hooks'

const [r, g, b, a] = useHex('#fff')
// [1, 1, 1, 1]

const clearColor = useHex('#0006')
// [0, 0, 0, 0.4]

convertHex('#4183c4')
// [0.2549019607843137, 0.5137254901960784, 0.7686274509803922, 1]

convertHex('#4183c4', true) // Drop the alpha by passing true as a second param 
// [0.2549019607843137, 0.5137254901960784, 0.7686274509803922]

gl.clearColor(...convertHex('#323334'))
```

## `useRgb(rgb, noAlpha?)` => `Array`
## `convertRgb(rgb, noAlpha?)` => `Array`

Convert rgb colors to WebGL friendly format. Exported as a hook (`useRgb`) and a utility function (`convertRgb`).

##### Arguments:

`rgb`: String rgb color e.g. `'rgb(40, 42, 54)'` or `'rgba(40, 42, 54, 75%)'`.

`noAlpha (optional)`: Boolean indicating if you want the alpha value in the array.

##### Returns:

`array`: An array of numbers between 0 and 1.  A four element array by default and three elements if the `noAlpha` parameter is used.

##### Example Usage:

```js
import {
  useRgb,
  convertRgb,
} from '@react-vertex/color-hooks'

const [r, g, b, a] = useRgb('rgb(255, 255, 255)');
// [1, 1, 1, 1]

const clearColor = convertRgb('rgb(255, 0, 255)', true)
// [1, 0, 1]
```


