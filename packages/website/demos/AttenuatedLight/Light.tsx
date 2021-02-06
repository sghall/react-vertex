import React from 'react'
import { useSphereElements } from '@react-vertex/geometry-hooks'
import { useBasicSolid } from '@react-vertex/material-hooks'

interface LightProps {
  lightPosition: number[]
}

export const Light: React.FC<LightProps> = React.memo(({ lightPosition }) => {
  const sphere = useSphereElements(0.75, 10, 10)
  const basicProgram = useBasicSolid()

  return (
    <material program={basicProgram}>
      <geometry position={lightPosition} {...sphere} />
    </material>
  )
})
