import React from 'react'
import PropTypes from 'prop-types'
import { useHex } from '@react-vertex/color-hooks'
import { useBasicProgram } from '@react-vertex/material-hooks'

function BasicSolid({ children }) {
  const kd = useHex('#16A5A5', true)
  const program = useBasicProgram(kd)

  return <material program={program}>{children}</material>
}

BasicSolid.propTypes = {
  children: PropTypes.node,
}

export default BasicSolid
