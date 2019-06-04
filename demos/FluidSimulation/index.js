import React, { useRef } from 'react'
import Button from '@material-ui/core/Button'
import { Canvas } from '@react-vertex/core'
import { useMeasure } from '@react-vertex/dom-hooks'
import { convertHex } from '@react-vertex/color-hooks'
import DemoWrapper from '../DemoWrapper'
import Scene from './Scene'

const clearColor = convertHex('#323334')

function FluidSimulation() {
  const container = useRef()
  const { width } = useMeasure(container)

  return (
    <DemoWrapper src="demos/FluidSimulation">
      <a href="https://github.com/PavelDoGreat/WebGL-Fluid-Simulation">
        <Button size="small">Original</Button>
      </a>
      <div ref={container}>
        <Canvas
          width={width}
          height={width}
          clearColor={clearColor}
          contextAttrs={{
            alpha: true,
            depth: false,
            stencil: false,
            antialias: false,
            preserveDrawingBuffer: false,
          }}
        >
          <Scene />
        </Canvas>
      </div>
    </DemoWrapper>
  )
}

export default FluidSimulation
