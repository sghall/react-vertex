import React, { memo } from 'react'
import { useCylinderElements } from '@react-vertex/geometry-hooks'

function Cylinder() {
  const elements = useCylinderElements(10, 10, 15, 50, 30)
  return <geometry {...elements} />
}

Cylinder.propTypes = {}

export default memo(Cylinder)
