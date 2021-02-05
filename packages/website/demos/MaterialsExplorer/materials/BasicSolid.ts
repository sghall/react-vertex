import React from 'react'
import PropTypes from 'prop-types'
import { useBasicSolid } from '@react-vertex/material-hooks'

function BasicSolid({ children, solidColor }) {
  const program = useBasicSolid(solidColor)

  return <material program={program}>{children}</material>
}

BasicSolid.propTypes = {
  children: PropTypes.node.isRequired,
  solidColor: PropTypes.array.isRequired,
}

export default BasicSolid
