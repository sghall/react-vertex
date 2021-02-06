import React from 'react'
import { useBasicSolid } from '@react-vertex/material-hooks'

import { DemoMaterialProps } from '.'

export const BasicSolid: React.FC<DemoMaterialProps> = ({
  children,
  solidColor,
}) => {
  const program = useBasicSolid(solidColor)

  return <material program={program}>{children}</material>
}
