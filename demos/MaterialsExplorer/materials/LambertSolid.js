import React from 'react'
import PropTypes from 'prop-types'
import { useHex } from '@react-vertex/color-hooks'
import { useLambertSolid } from '@react-vertex/material-hooks'

function LambertSolid({ children }) {
  const kd = useHex('#16A5A5', true)
  const program = useLambertSolid(kd, 0.25)

  return <material program={program}>{children}</material>
}

LambertSolid.propTypes = {
  children: PropTypes.node,
}

export default LambertSolid
