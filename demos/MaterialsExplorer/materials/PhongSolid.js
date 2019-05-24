import React from 'react'
import PropTypes from 'prop-types'
import { useHex } from '@react-vertex/color-hooks'
import { usePhongSolid } from '@react-vertex/material-hooks'

function SolidPhong({ children }) {
  const kd = useHex('#16A5A5', true)
  const program = usePhongSolid(kd, 0.25)

  return <material program={program}>{children}</material>
}

SolidPhong.propTypes = {
  children: PropTypes.node,
}

export default SolidPhong
