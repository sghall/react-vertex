import React from 'react'
import PropTypes from 'prop-types'
import { usePhongSolid } from '@react-vertex/material-hooks'

function PhongSolid({ children, solidColor, ambientLevel }) {
  const program = usePhongSolid(solidColor, ambientLevel)

  return <material program={program}>{children}</material>
}

PhongSolid.propTypes = {
  children: PropTypes.node,
  solidColor: PropTypes.array.isRequired,
  ambientLevel: PropTypes.number.isRequired,
}

export default PhongSolid
