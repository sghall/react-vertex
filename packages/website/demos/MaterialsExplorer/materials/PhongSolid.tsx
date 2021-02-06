import React from 'react'
import { usePhongSolid } from '@react-vertex/material-hooks'

import { DemoMaterialProps } from '.'

export const PhongSolid: React.FC<DemoMaterialProps> = ({
  children,
  solidColor,
  ambientLevel,
}) => {
  const program = usePhongSolid(solidColor, ambientLevel)

  return <material program={program}>{children}</material>
}
