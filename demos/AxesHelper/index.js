import React, { useRef, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { Canvas } from '@react-vertex/core'
import { useMeasure } from '@react-vertex/dom-hooks'
import { convertHex } from '@react-vertex/color-hooks'
import Scene from './Scene'

const clearColor = convertHex('#323334')

function AxesHelper() {
  const container = useRef()
  const { width } = useMeasure(container)

  const [showAxes, setShowAxes] = useState(false)

  return (
    <Grid style={{ padding: 12 }} container justify="center" spacing={8}>
      <Grid item xs={12} md={8}>
        <a href="https://github.com/sghall/react-vertex/tree/master/demos/AxesHelper">
          <Button size="small">Demo Source</Button>
        </a>
        <Button
          size="small"
          color="primary"
          variant="contained"
          onClick={() => setShowAxes(!showAxes)}
        >
          {showAxes ? 'Hide' : 'Show'} Axes
        </Button>
      </Grid>
      <Grid item xs={12} md={8}>
        <div ref={container}>
          <Canvas
            antialias
            width={width}
            height={width}
            clearColor={clearColor}
          >
            <Scene showAxes={showAxes} />
          </Canvas>
        </div>
      </Grid>
    </Grid>
  )
}

export default AxesHelper
