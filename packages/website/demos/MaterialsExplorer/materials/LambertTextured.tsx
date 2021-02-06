import React from 'react'
import { useTexture2d } from '@react-vertex/core'
import { useLambertTextured } from '@react-vertex/material-hooks'

import { DemoMaterialProps } from '.'

export const LambertTextured: React.FC<DemoMaterialProps> = ({
  children,
  textureUrl,
  ambientLevel,
}) => {
  const [texture] = useTexture2d(textureUrl)
  const program = useLambertTextured(texture, ambientLevel)

  return <material program={program}>{children}</material>
}
