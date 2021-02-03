import React from 'react'
import PropTypes from 'prop-types'
import { useTexture2d } from '@react-vertex/core'
import { useLambertTextured } from '@react-vertex/material-hooks'

function LambertTextured({ children, textureUrl, ambientLevel }) {
  const [texture] = useTexture2d(textureUrl)
  const program = useLambertTextured(texture, ambientLevel)

  return <material program={program}>{children}</material>
}

LambertTextured.propTypes = {
  children: PropTypes.node,
  textureUrl: PropTypes.string.isRequired,
  ambientLevel: PropTypes.number.isRequired,
}

export default LambertTextured
