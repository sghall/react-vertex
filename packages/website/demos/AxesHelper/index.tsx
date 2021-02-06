import React from 'react'
import Button from '@material-ui/core/Button'
import { Canvas } from '@react-vertex/core'
import { useMeasure } from 'react-use'
import { convertHex } from '@react-vertex/color-hooks'
import DemoWrapper from '../DemoWrapper'
import { Scene } from './Scene'

const clearColor = convertHex('#323334')

export const AxesHelper = () => {
  const [ref, dims] = useMeasure<HTMLDivElement>()
  const [showAxes, setShowAxes] = React.useState(false)

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
      <div ref={ref}>
        <Canvas
          antialias
          width={dims.width}
          height={dims.width}
          clearColor={clearColor}
          canvasStyle={{
            borderRadius: 4,
            cursor: 'pointer',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <Scene showAxes={showAxes} />
        </Canvas>
      </div>
    </DemoWrapper>
  )
}
