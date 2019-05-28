import React, { memo, useState, useEffect } from 'react'
import { timer } from 'd3-timer'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import { useCanvasSize, useRender } from '@react-vertex/core'
import Birds from './Birds'

function Scene() {
  const { width, height } = useCanvasSize()
  const renderScene = useRender()

  const [elapsed, setElapsed] = useState(0)

  const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
    c.setPosition([0, 0, 2000])
  })
  useOrbitControls(camera)

  useEffect(() => {
    const timerLoop = timer(e => {
      renderScene()
      setElapsed(e)
    })

    return () => timerLoop.stop()
  }, [renderScene])

  return (
    <camera view={camera.view} projection={camera.projection}>
      <group rotation={[0, -elapsed * 0.0002 + Math.PI / 2, 0]}>
        <group position={[200, 0, 0]}>
          <Birds elapsed={elapsed} />
        </group>
      </group>
    </camera>
  )
}

Scene.propTypes = {}

export default memo(Scene)
