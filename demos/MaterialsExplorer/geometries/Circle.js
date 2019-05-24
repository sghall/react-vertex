import React, { memo } from 'react'
import { useCircleElements } from '@react-vertex/geometry-hooks'

function Circle() {
  const elements = useCircleElements(10, 30)
  return <geometry {...elements} />
}

Circle.propTypes = {}

export default memo(Circle)
