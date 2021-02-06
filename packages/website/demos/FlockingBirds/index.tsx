import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { Canvas } from '@react-vertex/core'
import { useMeasure } from 'react-use'
import { convertHex } from '@react-vertex/color-hooks'
import DemoWrapper from '../DemoWrapper'
import { Scene } from './Scene'

const clearColor = convertHex('#323334')

const style: React.CSSProperties = {
  borderRadius: 4,
  cursor: 'pointer',
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
}

const link = 'https://threejs.org/examples/?q=gpg#webgl_gpgpu_birds'

function FlockingBirds() {
  const [ref, dims] = useMeasure<HTMLDivElement>()

  return (
    <DemoWrapper src="demos/FlockingBirds">
      <a href={link}>
        <Button size="small">Original</Button>
      </a>
      <div ref={ref}>
        <Canvas
          webgl2
          width={dims.width}
          height={dims.width}
          clearColor={clearColor}
          canvasStyle={style}
          extensions={['OES_texture_float']}
        >
          <Scene />
        </Canvas>
        <Typography>* Zooming is enabled on this demo.</Typography>
      </div>
    </DemoWrapper>
  )
}

export default FlockingBirds
