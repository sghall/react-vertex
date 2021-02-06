import React from 'react'
import { useSphereElements } from '@react-vertex/geometry-hooks'

export const Sphere = React.memo(() => {
  const elements = useSphereElements(11, 35, 35)
  return <geometry {...elements} />
})
