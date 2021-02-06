import React from 'react'
import { useCylinderElements } from '@react-vertex/geometry-hooks'

export const Cylinder = React.memo(() => {
  const elements = useCylinderElements(10, 10, 15, 50, 30)
  return <geometry {...elements} />
})
