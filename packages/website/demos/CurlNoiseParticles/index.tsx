import React from 'react'
import { Canvas } from '@react-vertex/core'
import { useMeasure } from 'react-use'
import { convertHex } from '@react-vertex/color-hooks'
import { DemoWrapper } from '../../components/DemoWrapper'
import { Scene } from './Scene'

const clearColor = convertHex('#323334')

const style: React.CSSProperties = {
  borderRadius: 4,
  cursor: 'pointer',
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
}

export function CurlNoiseParticles() {
  const [ref, dims] = useMeasure<HTMLDivElement>()

  return (
    <DemoWrapper src="demos/CurlNoiseParticles">
      <div ref={ref}>
        <Canvas
          webgl2
          width={dims.width}
          height={dims.width}
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
