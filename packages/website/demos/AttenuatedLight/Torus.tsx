import React from 'react'
import { useTexture2d } from '@react-vertex/core'
import { usePhongAttenuated } from '@react-vertex/material-hooks'
import { useTorusElements } from '@react-vertex/geometry-hooks'
import tiles from '../../public/static/textures/tiles_blue_diff.png'

interface TorusProps {
  lightPosition: number[]
}

export const Torus: React.FC<TorusProps> = React.memo(({ lightPosition }) => {
  const torus = useTorusElements(10, 3, 16, 100)

  const [texture] = useTexture2d(tiles)
  const program = usePhongAttenuated(lightPosition, texture)

  return (
    <material program={program}>
      <geometry {...torus} />
    </material>
  )
})
