import React, { memo } from 'react'
import {
  useWebGLContext,
  useTexture2d,
  useUniform2fv,
} from '@react-vertex/core'
import { useTexturedPhong } from '@react-vertex/material-hooks'
import { useTorusElements } from '@react-vertex/geometry-hooks'
import tilesDiffUrl from 'static/textures/tiles_pink_diff.png'

const uVScale = [6.0, 1.0]

function Torus() {
  const [texture] = useTexture2d(tilesDiffUrl)
  const program = useTexturedPhong(texture, 0.15, 500)

  const gl = useWebGLContext()
  useUniform2fv(gl, program, 'uVScale', uVScale)

  const torusElements = useTorusElements(10, 1, 16, 100)

  return (
    <material program={program}>
      <geometry {...torusElements} />
    </material>
  )
}

Torus.propTypes = {}

export default memo(Torus)
