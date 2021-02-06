import React from 'react'
import { useBoxElements } from '@react-vertex/geometry-hooks'

export const Box = React.memo(() => {
  const elements = useBoxElements(15, 15, 15, 20, 20, 20)
  return <geometry {...elements} />
})
