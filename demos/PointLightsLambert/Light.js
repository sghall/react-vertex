import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useSphereElements } from '@react-vertex/geometry-hooks'
import { useBasicSolid } from '@react-vertex/material-hooks'

function Light({ color, position }) {
  const sphere = useSphereElements(0.5, 10, 10)
  const program = useBasicSolid(color)

  return (
    <material program={program}>
      <geometry position={position} {...sphere} />
    </material>
  )
}

Light.propTypes = {
  color: PropTypes.array.isRequired,
  position: PropTypes.array.isRequired,
}

export default memo(Light)
