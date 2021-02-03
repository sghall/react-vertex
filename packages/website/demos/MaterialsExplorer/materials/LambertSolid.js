import React from 'react'
import PropTypes from 'prop-types'
import { useLambertSolid } from '@react-vertex/material-hooks'

function LambertSolid({ children, solidColor, ambientLevel }) {
  const program = useLambertSolid(solidColor, ambientLevel)

  return <material program={program}>{children}</material>
}

LambertSolid.propTypes = {
  children: PropTypes.node.isRequired,
  solidColor: PropTypes.array.isRequired,
  ambientLevel: PropTypes.number.isRequired,
}

export default LambertSolid
