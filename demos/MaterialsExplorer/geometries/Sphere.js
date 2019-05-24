import React, { memo } from 'react'
import { useSphereElements } from '@react-vertex/geometry-hooks'

function Sphere() {
  const elements = useSphereElements(11, 35, 35)
  return <geometry {...elements} />
}

Sphere.propTypes = {}

export default memo(Sphere)
