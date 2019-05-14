import React, { memo, useState, useEffect } from 'react'
import { timer } from 'd3-timer'
import PropTypes from 'prop-types'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import { useCanvasSize, useRender, usePointLight } from '@react-vertex/core'
import { useHex } from '@react-vertex/color-hooks'
import Torus from './Torus'
import Spheres from './Spheres'
import { AxesHelper } from '@react-vertex/scene-helpers'

function Scene({ showAxes }) {
  const { width, height } = useCanvasSize()

  const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
    c.setPosition([0, 0, 30])
  })
  useOrbitControls(camera)

  const [elapsed, setElapsed] = useState(0)
  const renderScene = useRender()

  const lightColor = useHex('#fff')
  usePointLight(lightColor, [0, 0, 0])

  useEffect(() => {
    const timerLoop = timer(e => {
      renderScene()
      setElapsed(e)
    })

    return () => timerLoop.stop()
  }, [renderScene])

  return (
    <camera camera={camera}>
      {showAxes && <AxesHelper size={10} />}
      <Torus />
      <Spheres elapsed={elapsed} showAxes={showAxes} />
    </camera>
  )
}

Scene.propTypes = {
  showAxes: PropTypes.bool.isRequired,
}

export default memo(Scene)
