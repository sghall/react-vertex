import React, { memo } from 'react'
import { useHex } from '@react-vertex/color-hooks'
import { useSolidPhong } from '@react-vertex/material-hooks'
import { useSphereElements } from '@react-vertex/geometry-hooks'

function Sphere() {
  const radius = 10
  const sphere = useSphereElements(radius, 30, 30)
  const kd = useHex('#9B9B9B', true)

  const program = useSolidPhong(kd, 0.15)

  return (
    <material program={program}>
      <geometry {...sphere} />
    </material>
  )
}

Sphere.propTypes = {}

export default memo(Sphere)
