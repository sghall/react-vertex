import React, { memo } from 'react'
import { useTorusElements } from '@react-vertex/geometry-hooks'

function Torus() {
  const elements = useTorusElements(10, 4, 16, 100)
  return <geometry {...elements} />
}

Torus.propTypes = {}

export default memo(Torus)
