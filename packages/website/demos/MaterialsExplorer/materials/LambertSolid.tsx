import React from 'react'
import { useLambertSolid } from '@react-vertex/material-hooks'

import { DemoMaterialProps } from '.'

export const LambertSolid: React.FC<DemoMaterialProps> = ({
  children,
  solidColor,
  ambientLevel,
}) => {
  const program = useLambertSolid(solidColor, ambientLevel)

  return <material program={program}>{children}</material>
}
