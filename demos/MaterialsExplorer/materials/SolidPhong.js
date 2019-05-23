import React from 'react'
import PropTypes from 'prop-types'
import { useSolidPhong } from '@react-vertex/material-hooks'
import { useColorSlider, useValueSlider } from '@react-vertex/scene-helpers'

function SolidPhong({ children }) {
  const kd = useColorSlider('Diffuse Color:', '#9B9B9B', true)
  const na = useValueSlider('Ambient Level:', 0.2, 0, 1, 0.01)

  const program = useSolidPhong(kd, na)

  return (
    <material program={program}>
      {children}
    </material>
  )
}

SolidPhong.propTypes = {
  children: PropTypes.node.isRequired
}

export default SolidPhong
