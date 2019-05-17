import React, { useEffect } from 'react'
import { useRender } from '@react-vertex/core'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import { useBasicProgram } from '@react-vertex/material-hooks'
import { AxesHelper, useColorSlider } from '@react-vertex/scene-helpers'
import { useCanvasSize } from '@react-vertex/core'
import TunaGeometry from './TunaGeometry'

function Scene() {
  const { width, height } = useCanvasSize()

  const renderScene = useRender()

  const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
    c.setPosition([0, 0, 25])
    c.setRotY(80)
  })
  useOrbitControls(camera)

  useEffect(() => {
    renderScene()
    camera.addListener(renderScene)
    return () => camera.removeListener(renderScene)
  }, [camera, renderScene])

  const color = useColorSlider('Wireframe Color: ', '#A9E6E3', true)
  const basicProgram = useBasicProgram(color)

  return (
    <camera view={camera.view} projection={camera.projection}>
      <AxesHelper size={10} />
      <material program={basicProgram}>
        <TunaGeometry />
      </material>
    </camera>
  )
}

Scene.propTypes = {}

export default Scene
