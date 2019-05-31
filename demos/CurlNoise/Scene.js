import React, { memo, useState, useEffect } from 'react'
import { timer } from 'd3-timer'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import {
  useCanvasSize,
  useRender,
  useWebGLContext,
  useDataTexture,
} from '@react-vertex/core'
import { useDataTextures } from './PingPong'
import Birds from './Birds'
import { useBoxElements } from '@react-vertex/geometry-hooks'
import { useBasicTextured } from '@react-vertex/material-hooks'

const size = 32
const colors = new Float32Array(size * size * 4)

for (let i = 0; i < size * size; i++) {
  const x = (i % size) / size
  const y = Math.floor(i / size) / size

  colors[i * 4 + 0] = 1 - x
  colors[i * 4 + 1] = x
  colors[i * 4 + 2] = 1 - y
  colors[i * 4 + 3] = 1
}

function Scene() {
  const { width, height } = useCanvasSize()
  const renderScene = useRender()

  const [elapsed, setElapsed] = useState(0)

  const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
    c.setPosition([0, 0, 50])
  })
  useOrbitControls(camera)

  const gl = useWebGLContext()
  const texVelocity = useDataTexture(gl, colors, size, size)

  const material = useBasicTextured(texVelocity)
  const geometry = useBoxElements(20, 20, 20)

  useEffect(() => {
    const timerLoop = timer(e => {
      renderScene()
      setElapsed(e)
    })

    return () => timerLoop.stop()
  }, [renderScene])

  return (
    <camera view={camera.view} projection={camera.projection}>
      <material program={material}>
        <geometry {...geometry} />
      </material>
    </camera>
  )
}

Scene.propTypes = {}

export default memo(Scene)
