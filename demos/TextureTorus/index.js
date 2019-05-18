import React, { useRef } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { Canvas } from '@react-vertex/core'
import { useMeasure } from '@react-vertex/dom-hooks'
import { convertHex } from '@react-vertex/color-hooks'
import Scene from './Scene'

const clearColor = convertHex('#323334')

function PointLight() {
  const container = useRef()
  const { width } = useMeasure(container)

  return (
    <Grid style={{ padding: 12 }} container justify="center" spacing={8}>
      <Grid item xs={12} md={8}>
        <a href="https://github.com/sghall/react-vertex/tree/master/demos/TextureTorus">
          <Button size="small">Demo Source</Button>
        </a>
        <a href="https://github.com/stackgl/glsl-lighting-walkthrough">
          <Button size="small">Credit</Button>
        </a>
      </Grid>
      <Grid item xs={12} md={8}>
        <div ref={container}>
          <Canvas
            antialias
            width={width}
            height={width}
            clearColor={clearColor}
            canvasStyle={{
              borderRadius: 4,
              cursor: 'pointer',
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <Scene />
          </Canvas>
        </div>
      </Grid>
    </Grid>
  )
}

export default PointLight
