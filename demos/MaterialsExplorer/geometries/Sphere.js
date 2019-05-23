import React, { memo } from 'react'
import { useSphereElements } from '@react-vertex/geometry-hooks'
import { useValueSlider } from '@react-vertex/scene-helpers'

function Sphere() {
  const radius = useValueSlider('Sphere Radius:', 10, 10, 20, 0.1)
  const sphere = useSphereElements(radius, 30, 30)

  return <geometry {...sphere} />
}

Sphere.propTypes = {}

export default memo(Sphere)
