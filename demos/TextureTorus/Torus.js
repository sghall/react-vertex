import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useAttenuatedPhong } from '@react-vertex/material-hooks'
import { useTorusElements } from '@react-vertex/geometry-hooks'
import tilesDiffUrl from 'static/textures/tiles_blue_diff.png'

function Torus({ lightPosition }) {
  const torus = useTorusElements(10, 3, 16, 100)
  const program = useAttenuatedPhong(lightPosition, tilesDiffUrl)

  return (
    <material program={program}>
      <geometry {...torus} />
    </material>
  )
}

Torus.propTypes = {
  lightPosition: PropTypes.array.isRequired,
}

export default memo(Torus)
