import React from 'react'
import PropTypes from 'prop-types'
import { useTexture2d } from '@react-vertex/core'
import { useTexturedPhong } from '@react-vertex/material-hooks'
import { useColorSlider, useValueSlider } from '@react-vertex/scene-helpers'

function TexturedPhong({ children, textureUrl }) {

  const ks = useColorSlider('Specular Color:', '#F0F0F0', true)
  const ns = useValueSlider('Shininess:', 600, 0, 1000, 5)

  const ka = useColorSlider('Ambient Color:', '#808080', true)
  const na = useValueSlider('Ambient Level:', 0.2, 0, 1, 0.01)

  const [texture] = useTexture2d(textureUrl)

  const program = useTexturedPhong(texture, na, ns, ka, ks)

  return (
    <material program={program}>
      {children}
    </material>
  )
}

TexturedPhong.propTypes = {
  children: PropTypes.node.isRequired,
  textureUrl: PropTypes.string.isRequired,
}

export default TexturedPhong
