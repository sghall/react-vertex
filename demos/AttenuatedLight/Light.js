import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useSphereElements } from '@react-vertex/geometry-hooks'
import { useBasicProgram } from '@react-vertex/material-hooks'

function Light({ lightPosition }) {
  const sphere = useSphereElements(0.75, 10, 10)
  const basicProgram = useBasicProgram()

  return (
    <material program={basicProgram}>
      <geometry position={lightPosition} {...sphere} />
    </material>
  )
}

Light.propTypes = {
  lightPosition: PropTypes.array.isRequired,
}

export default memo(Light)
