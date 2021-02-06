import React from 'react'
import { timer } from 'd3-timer'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import { useCanvasSize, useRender, usePointLight } from '@react-vertex/core'
import { useHex } from '@react-vertex/color-hooks'
import { Torus } from './Torus'
import { Spheres } from './Spheres'
import { AxesHelper } from '@react-vertex/scene-helpers'
interface SceneProps {
  showAxes: boolean
}

export const Scene: React.FC<SceneProps> = React.memo(({ showAxes }) => {
  const { width = 1, height = 1 } = useCanvasSize()

  const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
    c.setPosition([0, 0, 30])
  })
  useOrbitControls(camera)

  const [elapsed, setElapsed] = React.useState(0)
  const renderScene = useRender()

  const lightColor = useHex('#fff')
  usePointLight(lightColor, [0, 0, 0])

  React.useEffect(() => {
    const timerLoop = timer(e => {
      renderScene()
      setElapsed(e)
    })

    return () => timerLoop.stop()
  }, [renderScene])

  return (
    <camera view={camera.view} projection={camera.projection}>
      {showAxes && <AxesHelper size={10} />}
      <Torus />
      <Spheres elapsed={elapsed} showAxes={showAxes} />
    </camera>
  )
})
