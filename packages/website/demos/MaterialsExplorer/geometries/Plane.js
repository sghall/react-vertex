import React, { memo } from 'react'
import { usePlaneElements } from '@react-vertex/geometry-hooks'

function Plane() {
  const elements = usePlaneElements(15, 15, 30, 30)
  return <geometry {...elements} />
}

Plane.propTypes = {}

export default memo(Plane)
