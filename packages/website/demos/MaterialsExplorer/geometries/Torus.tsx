import React from 'react'
import { useTorusElements } from '@react-vertex/geometry-hooks'

export const Torus = React.memo(() => {
  const elements = useTorusElements(10, 4, 16, 100)
  return <geometry {...elements} />
})
