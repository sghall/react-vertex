import React, { useRef } from 'react'
import { Canvas } from '@react-vertex/core'
import { useMeasure } from '@react-vertex/dom-hooks'
import { convertHex } from '@react-vertex/color-hooks'
import DemoWrapper from '../DemoWrapper'
import Scene from './Scene'

const clearColor = convertHex('#323334')

function PointLightsLambert() {
  const container = useRef()
  const { width } = useMeasure(container)

  return (
    <DemoWrapper src="demos/PointLightsLambert">
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
    </DemoWrapper>
  )
}

export default PointLightsLambert
