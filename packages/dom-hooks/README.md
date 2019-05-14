# `@react-vertex/dom-hooks`

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/sghall/react-vertex/blob/master/packages/dom-hooks/LICENSE)
[![npm version](https://img.shields.io/npm/v/@react-vertex/dom-hooks.svg)](https://www.npmjs.com/package/@react-vertex/dom-hooks)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/@react-vertex/dom-hooks)](https://bundlephobia.com/result?p=@react-vertex/dom-hooks)

### [Documentation and Examples](https://react-vertex.com)

React hooks for DOM operations.

##### Install via npm:
```js
npm install @react-vertex/dom-hooks
```

#### Importing:

```js
import {
  useMeasure,
} from '@react-vertex/dom-hooks'
```
## `useMeasure(ref)` => `bounds`

React hook to get measurements of a DOM element.

##### Arguments:

`ref`: A React ref for the element you want to measure.

##### Returns:

`bounds`: An object: `{ left: 0, top: 0, width: 100, height: 100 }`

##### Example Usage:

```js
import React, { useRef } from 'react'
import { useMeasure } from '@react-vertex/dom-hooks'

function Example() {
  const container = useRef()
  const { width, height } = useMeasure(container)
    
  return (
    <div ref={container}>
      <Scene
        width={width}
        height={height}
      >
        ...
      </Scene>
    </div>
  )
}

```