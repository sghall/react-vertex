import React from 'react'
import PropTypes from 'prop-types'
import { useTexture2d } from '@react-vertex/core'
import { useTexturedPhong } from '@react-vertex/material-hooks'

function TexturedPhong({ children, textureUrl }) {
  const [texture] = useTexture2d(textureUrl)
  const program = useTexturedPhong(texture, 0.25)

  return (
    <material program={program}>
      {children}
    </material>
  )
}

TexturedPhong.propTypes = {
  children: PropTypes.node,
  textureUrl: PropTypes.string.isRequired,
}

export default TexturedPhong
