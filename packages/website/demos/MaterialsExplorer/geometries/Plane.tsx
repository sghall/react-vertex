import React from 'react'
import { usePlaneElements } from '@react-vertex/geometry-hooks'

export const Plane = React.memo(() => {
  const elements = usePlaneElements(15, 15, 30, 30)
  return <geometry {...elements} />
})
