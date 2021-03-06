import React from 'react'
import { useTexture2d } from '@react-vertex/core'
import { usePhongTextured } from '@react-vertex/material-hooks'

import { DemoMaterialProps } from '.'

export const PhongTextured: React.FC<DemoMaterialProps> = ({
  children,
  textureUrl,
  ambientLevel,
}) => {
  const [texture] = useTexture2d(textureUrl)
  const program = usePhongTextured(texture, ambientLevel)

  return <material program={program}>{children}</material>
}
