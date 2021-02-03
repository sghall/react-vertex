import React from 'react'
import PropTypes from 'prop-types'
import { useTexture2d } from '@react-vertex/core'
import { useBasicTextured } from '@react-vertex/material-hooks'

function BasicTextured({ children, textureUrl }) {
  const [texture] = useTexture2d(textureUrl)
  const program = useBasicTextured(texture)

  return <material program={program}>{children}</material>
}

BasicTextured.propTypes = {
  children: PropTypes.node,
  textureUrl: PropTypes.string.isRequired,
}

export default BasicTextured
