import React, { useRef } from 'react'
import { Canvas } from '@react-vertex/core'
import { useMeasure } from '@react-vertex/dom-hooks'
import { convertHex } from '@react-vertex/color-hooks'
import DemoWrapper from '../DemoWrapper'
import Scene from './Scene'

const clearColor = convertHex('#323334')

const style = {
  borderRadius: 4,
  cursor: 'pointer',
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
}

function FlockingBirds() {
  const container = useRef()
  const { width } = useMeasure(container)

  return (
    <DemoWrapper src="demos/CurlNoiseParticles">
      <div ref={container}>
        <Canvas
          webgl2
          width={width}
          height={width}
          canvasStyle={style}
          clearColor={clearColor}
          extensions={['OES_texture_float']}
        >
          <Scene />
        </Canvas>
      </div>
    </DemoWrapper>
  )
}

export default FlockingBirds
