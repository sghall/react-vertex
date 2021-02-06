import React from 'react'
import { Canvas } from '@react-vertex/core'
import { useMeasure } from 'react-use'
import { convertHex } from '@react-vertex/color-hooks'
import { DemoWrapper } from '../../components/DemoWrapper'
import { Scene } from './Scene'

const clearColor = convertHex('#323334')

export function TextureCubes() {
  const [ref, dims] = useMeasure<HTMLDivElement>()

  return (
    <DemoWrapper src="demos/TextureCubes">
      <div ref={ref}>
        <Canvas
          antialias
          width={dims.width}
          height={dims.width}
          clearColor={clearColor}
        >
          <Scene />
        </Canvas>
      </div>
    </DemoWrapper>
  )
}
