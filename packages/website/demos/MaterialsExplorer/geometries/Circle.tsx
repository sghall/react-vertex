import React from 'react'
import { useCircleElements } from '@react-vertex/geometry-hooks'

export const Circle = React.memo(() => {
  const elements = useCircleElements(10, 50)
  return <geometry {...elements} />
})
