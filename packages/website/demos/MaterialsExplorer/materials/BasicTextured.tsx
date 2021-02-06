import React from 'react'
import { useTexture2d } from '@react-vertex/core'
import { useBasicTextured } from '@react-vertex/material-hooks'

import { DemoMaterialProps } from '.'

export const BasicTextured: React.FC<DemoMaterialProps> = ({
  children,
  textureUrl,
}) => {
  const [texture] = useTexture2d(textureUrl)
  const program = useBasicTextured(texture)

  return <material program={program}>{children}</material>
}
