import React, { useRef } from 'react'
import { Canvas } from '@react-vertex/core'
import { useMeasure } from '@react-vertex/dom-hooks'
import { convertHex } from '@react-vertex/color-hooks'
import DemoWrapper from '../DemoWrapper'
import Scene from './Scene'

const clearColor = convertHex('#323334')

function TextureCubes() {
  const container = useRef()
  const { width } = useMeasure(container)

  return (
    <DemoWrapper src="demos/TextureCubes">
      <div ref={container}>
        <Canvas antialias width={width} height={width} clearColor={clearColor}>
          <Scene />
        </Canvas>
      </div>
    </DemoWrapper>
  )
}

export default TextureCubes
