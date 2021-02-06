import React from 'react'
import { timer } from 'd3-timer'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import { useCanvasSize, useRender, usePointLight } from '@react-vertex/core'
import { useHex } from '@react-vertex/color-hooks'
import { Sphere } from './Sphere'
import { Light } from './Light'
import { AxesHelper } from '@react-vertex/scene-helpers'

export const Scene = React.memo(() => {
  const { width = 1, height = 1 } = useCanvasSize()

  const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
    c.setPosition([0, 0, 60])
  })
  useOrbitControls(camera)

  const [rLightPosition, setRLightPostion] = React.useState([0, 0, 0])
  const [gLightPosition, setGLightPostion] = React.useState([0, 0, 0])
  const [bLightPosition, setBLightPostion] = React.useState([0, 0, 0])

  const r = useHex('#ff0000', true)
  const g = useHex('#00ff00', true)
  const b = useHex('#0000ff', true)

  usePointLight(r, rLightPosition)
  usePointLight(g, gLightPosition)
  usePointLight(b, bLightPosition)

  const renderScene = useRender()

  React.useEffect(() => {
    const timerLoop = timer(elapsed => {
      renderScene()

      const time = elapsed * 0.0006

      const k1 = 0.25 + Math.sin(time) * 21
      const k2 = 0.25 + Math.cos(time) * 21

      setRLightPostion([k1, k1, k2])
      setGLightPostion([k1, k2, k1])
      setBLightPostion([k2, k1, k1])
    })

    return () => timerLoop.stop()
  }, [renderScene])

  return (
    <camera view={camera.view} projection={camera.projection}>
      <AxesHelper size={30} />
      <Sphere />
      <Light color={r} position={rLightPosition} />
      <Light color={g} position={gLightPosition} />
      <Light color={b} position={bLightPosition} />
    </camera>
  )
})
