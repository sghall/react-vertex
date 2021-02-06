import React from 'react'
import { Canvas } from '@react-vertex/core'
import { useMeasure } from 'react-use'
import { convertHex } from '@react-vertex/color-hooks'
import { DemoWrapper } from '../../components/DemoWrapper'
import { Scene } from './Scene'

const clearColor = convertHex('#323334')

export function PointLightsPhong() {
  const [ref, dims] = useMeasure<HTMLDivElement>()

  return (
    <DemoWrapper src="demos/PointLightsPhong">
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
          <Scene />
        </Canvas>
      </div>
    </DemoWrapper>
  )
}
