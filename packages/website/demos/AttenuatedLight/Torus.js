import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTexture2d } from '@react-vertex/core'
import { usePhongAttenuated } from '@react-vertex/material-hooks'
import { useTorusElements } from '@react-vertex/geometry-hooks'
import tiles from 'static/textures/tiles_blue_diff.png'

function Torus({ lightPosition }) {
  const torus = useTorusElements(10, 3, 16, 100)

  const [texture] = useTexture2d(tiles)
  const program = usePhongAttenuated(lightPosition, texture)

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
