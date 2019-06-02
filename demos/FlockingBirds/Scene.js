import React, { memo, useState, useEffect } from 'react'
import { timer } from 'd3-timer'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import { useCanvasSize, useRender } from '@react-vertex/core'
import { useDataTextures } from './PingPong'
import Birds from './Birds'

const size = 64

function Scene() {
  const { width, height } = useCanvasSize()
  const renderScene = useRender()

  const [elapsed, setElapsed] = useState(0)

  const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
    c.setPosition([0, 0, 500])
  })
  useOrbitControls(camera)

  const [posUnit, velUnit] = useDataTextures(size)

  useEffect(() => {
    const timerLoop = timer(e => {
      renderScene()
      setElapsed(e * 0.001)
    })

    return () => timerLoop.stop()
  }, [renderScene])

  return (
    <camera view={camera.view} projection={camera.projection}>
      <Birds
        size={size}
        elapsed={elapsed}
        posUnit={posUnit}
        velUnit={velUnit}
      />
    </camera>
  )
}

Scene.propTypes = {}

export default memo(Scene)
