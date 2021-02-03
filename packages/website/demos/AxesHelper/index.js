import React, { useRef, useState } from 'react'
import Button from '@material-ui/core/Button'
import { Canvas } from '@react-vertex/core'
import { useMeasure } from '@react-vertex/dom-hooks'
import { convertHex } from '@react-vertex/color-hooks'
import DemoWrapper from '../DemoWrapper'
import Scene from './Scene'

const clearColor = convertHex('#323334')

function AxesHelper() {
  const container = useRef()
  const { width } = useMeasure(container)

  const [showAxes, setShowAxes] = useState(false)

  return (
    <DemoWrapper src="demos/AxesHelper">
      <Button
        size="small"
        style={{ margin: 4 }}
        color="primary"
        variant="contained"
        onClick={() => setShowAxes(!showAxes)}
      >
        {showAxes ? 'Hide' : 'Show'} Axes
      </Button>
      <div ref={container}>
        <Canvas antialias width={width} height={width} clearColor={clearColor}>
          <Scene showAxes={showAxes} />
        </Canvas>
      </div>
    </DemoWrapper>
  )
}

export default AxesHelper
