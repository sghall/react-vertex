import React, { memo, useState, useEffect } from 'react'
import { timer } from 'd3-timer'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import { useWebGLContext, useCanvasSize, useRender, useDataTexture } from '@react-vertex/core'
import { randomPositions, randomVelocities } from './utils'
import Birds from './Birds'

const size = 16
const positionData = randomPositions(size)
const velocityData = randomVelocities(size)

function Scene() {
  const { width, height } = useCanvasSize()
  const renderScene = useRender()

  const [elapsed, setElapsed] = useState(0)

  const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
    c.setPosition([0, 0, 500])
  })
  useOrbitControls(camera)

  const gl = useWebGLContext()
  const texPosition = useDataTexture(gl, positionData, size, size)
  const texVelocity = useDataTexture(gl, velocityData, size, size)

  useEffect(() => {
    const timerLoop = timer(e => {
      renderScene()
      setElapsed(e)
    })

    return () => timerLoop.stop()
  }, [renderScene])

  return (
    <camera view={camera.view} projection={camera.projection}>
      <Birds
        elapsed={elapsed}
        texPosition={texPosition}
        texVelocity={texVelocity}
      />
    </camera>
  )
}

Scene.propTypes = {}

export default memo(Scene)
