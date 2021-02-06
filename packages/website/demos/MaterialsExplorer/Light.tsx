import React from 'react'
import { useSphereElements } from '@react-vertex/geometry-hooks'
import { useBasicSolid } from '@react-vertex/material-hooks'

interface LightProps {
  color: number[]
  position: number[]
}

export const Light: React.FC<LightProps> = React.memo(({ color, position }) => {
  const sphere = useSphereElements(0.5, 10, 10)
  const program = useBasicSolid(color)

  return (
    <material program={program}>
      <geometry position={position} {...sphere} />
    </material>
  )
})
