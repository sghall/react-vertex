import React, { useRef } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { Canvas } from '@react-vertex/core'
import { useMeasure } from '@react-vertex/dom-hooks'
import { convertHex } from '@react-vertex/color-hooks'
import Scene from './Scene'

const clearColor = convertHex('#323334')

function TunaWireframe() {
  const container = useRef()
  const { width } = useMeasure(container)

  return (
    <Grid container justify="center">
      <Grid item xs={12} md={8}>
        <a href="https://github.com/sghall/react-vertex/tree/master/demos/TunaWireframe">
          <Button size="small">Demo Source</Button>
        </a>
        <div ref={container}>
          <Canvas
            antialias
            width={width}
            height={width}
            renderOnUpdate
            clearColor={clearColor}
          >
            <Scene />
          </Canvas>
        </div>
      </Grid>
    </Grid>
  )
}

export default TunaWireframe
