import React, { useState, useEffect } from 'react'
import { timer } from 'd3-timer'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import { useCanvasSize, useRender, usePointLight } from '@react-vertex/core'
import { useHex } from '@react-vertex/color-hooks'
import { Sphere, Torus, Cylinder, Box, Plane, Circle } from './geometries'
import { SolidPhong, TexturedPhong, BasicSolid, BasicTextured } from './materials'
import tilesBlue from 'static/textures/tiles_blue_diff.png'
import tilesPink from 'static/textures/tiles_pink_diff.png'
import hexagons from 'static/textures/hexagons.jpg'
import fancyTile from 'static/textures/fancy_tile.jpg'
import Light from './Light'
import { AxesHelper, useSelectControl } from '@react-vertex/scene-helpers'

function PointLightScene() {
  const { width, height } = useCanvasSize()

  const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
    c.setPosition([0, 0, 60])
  })
  useOrbitControls(camera)

  const [lightPosition, setLightPostion] = useState([0, 0, 0])

  const { value: Material } = useSelectControl('Material: ', [
    { value: BasicTextured, label: 'Basic Textured' },
    { value: BasicSolid, label: 'Basic Solid' },
    { value: TexturedPhong, label: 'Textured Phong' },
    { value: SolidPhong, label: 'Solid Phong' },
  ])

  const { value: Geometry } = useSelectControl('Geometry: ', [
    { value: Cylinder, label: 'Cylinder' },
    { value: Sphere, label: 'Sphere' },
    { value: Torus, label: 'Torus' },
    { value: Box, label: 'Box' },
    { value: Circle, label: 'Circle' },
    { value: Plane, label: 'Plane' },
  ])

  const { value: textureUrl } = useSelectControl('Texture: ', [
    { value: tilesBlue, label: 'Blue Tiles' },
    { value: tilesPink, label: 'Pink Tiles' },
    { value: hexagons, label: 'Abstract' },
    { value: fancyTile, label: 'Fancy Tile' },
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
      <Material textureUrl={textureUrl}>
        <Geometry />
      </Material>
      <Light color={lightColor} position={lightPosition} />
    </camera>
  )
}

PointLightScene.propTypes = {}

export default PointLightScene
