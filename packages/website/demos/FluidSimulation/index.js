import React, { useRef } from 'react'
import Button from '@material-ui/core/Button'
import { Canvas } from '@react-vertex/core'
import { useMeasure } from '@react-vertex/dom-hooks'
import DemoWrapper from '../DemoWrapper'
import Simulation from './Simulation'

const attrs = {
  alpha: true,
  depth: false,
  stencil: false,
  antialias: false,
  preserveDrawingBuffer: false,
}

const style = {
  borderRadius: 4,
  cursor: 'pointer',
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
}

const link = 'https://github.com/PavelDoGreat/WebGL-Fluid-Simulation'

function FluidSimulation() {
  const container = useRef()
  const { width } = useMeasure(container)

  return (
    <DemoWrapper src="demos/FluidSimulation">
      <a href={link}>
        <Button size="small">Original</Button>
      </a>
      <div ref={container}>
        {width ? (
          <Canvas
            webgl2
            width={width}
            height={width}
            canvasStyle={style}
            contextAttrs={attrs}
          >
            <Simulation />
          </Canvas>
        ) : null}
      </div>
    </DemoWrapper>
  )
}

export default FluidSimulation
