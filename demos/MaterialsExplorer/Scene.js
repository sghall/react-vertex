import React, { useState, useEffect } from 'react'
import { timer } from 'd3-timer'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import { useCanvasSize, useRender, usePointLight } from '@react-vertex/core'
import { useHex } from '@react-vertex/color-hooks'
import { Sphere, Torus, Cylinder, Box, Plane, Circle } from './geometries'
import {
  PhongSolid,
  PhongTextured,
  LambertSolid,
  LambertTextured,
  BasicSolid,
  BasicTextured,
} from './materials'
import tilesBlue from 'static/textures/tiles_blue_diff.png'
import tilesPink from 'static/textures/tiles_pink_diff.png'
import hexagons from 'static/textures/hexagons.jpg'
import fancyTile from 'static/textures/fancy_tile.jpg'
import Light from './Light'
import {
  AxesHelper,
  useSelectControl,
  useValueSlider,
  useColorSlider,
} from '@react-vertex/scene-helpers'

// prettier-ignore
function Scene() {
  const { width, height } = useCanvasSize()

  const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
    c.setPosition([0, 0, 60])
  })
  useOrbitControls(camera)

  const solidColor = useColorSlider('Solid Color (solid materials only): ', '#D33115', true)

  const { value: textureUrl } = useSelectControl('Texture (textured materials only): ', [
    { value: tilesBlue, label: 'Blue Tiles' },
    { value: tilesPink, label: 'Pink Tiles' },
    { value: hexagons, label: 'Abstract' },
    { value: fancyTile, label: 'Fancy Tile' },
  ])

  const ambientLevel = useValueSlider('Ambient Level: ', 0.2, 0, 1, 0.01)

  const [lightPosition, setLightPostion] = useState([0, 0, 0])

  const { value: Material } = useSelectControl('Material: ', [
    { value: PhongTextured, label: 'Phong Textured' },
    { value: PhongSolid, label: 'Phong Solid' },
    { value: BasicTextured, label: 'Basic Textured' },
    { value: BasicSolid, label: 'Basic Solid' },
    { value: LambertTextured, label: 'Lambert Textured' },
    { value: LambertSolid, label: 'Lambert Solid' },
  ])

  const { value: Geometry } = useSelectControl('Geometry: ', [
    { value: Sphere, label: 'Sphere' },
    { value: Box, label: 'Box' },
    { value: Torus, label: 'Torus' },
    { value: Cylinder, label: 'Cylinder' },
    { value: Circle, label: 'Circle' },
    { value: Plane, label: 'Plane' },
  ])

  const lightColor = useHex('#ffffff', true)

  usePointLight(lightColor, lightPosition)

  const renderScene = useRender()

  useEffect(() => {
    const timerLoop = timer(elapsed => {
      renderScene()

      const time = elapsed * 0.002

      const k1 = 0.25 + Math.sin(time) * 21
      const k2 = 0.25 + Math.cos(time) * 21

      setLightPostion([k1, k1, k2])
    })

    return () => timerLoop.stop()
  }, [renderScene])

  return (
    <camera view={camera.view} projection={camera.projection}>
      <AxesHelper size={30} />
      <Material
        solidColor={solidColor}
        textureUrl={textureUrl}
        ambientLevel={ambientLevel}
      >
        <Geometry />
      </Material>
      <Light color={lightColor} position={lightPosition} />
    </camera>
  )
}

Scene.propTypes = {}

export default Scene
