import React, { memo } from 'react'
import { useBoxElements } from '@react-vertex/geometry-hooks'

function Box() {
  const elements = useBoxElements(15, 15, 15, 10, 10, 10)
  return <geometry {...elements} />
}

Box.propTypes = {}

export default memo(Box)
