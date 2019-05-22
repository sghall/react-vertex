import React, { memo, useState, useEffect } from 'react'
import { timer } from 'd3-timer'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import { useCanvasSize, useRender } from '@react-vertex/core'
import Torus from './Torus'
import Light from './Light'
import { AxesHelper } from '@react-vertex/scene-helpers'

function PointLightScene() {
  const { width, height } = useCanvasSize()

  const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
    c.setPosition([0, 0, 40])
  })
  useOrbitControls(camera)

  const [lightPosition, setLightPosition] = useState([0, 0, 0])

  const renderScene = useRender()

  useEffect(() => {
    const timerLoop = timer(elapsed => {
      renderScene()

      const time = elapsed * 0.003

      const x = 0.25 + Math.cos(time) * 10
      const y = 0.25 + Math.cos(time) * 10
      const z = 0.75 + Math.sin(time) * 10

      setLightPosition([x, y, z])
    })

    return () => timerLoop.stop()
  }, [renderScene])

  return (
    <camera view={camera.view} projection={camera.projection}>
      <AxesHelper size={10} />
      <Torus lightPosition={lightPosition} />
      <Light lightPosition={lightPosition} />
    </camera>
  )
}

PointLightScene.propTypes = {}

export default memo(PointLightScene)
