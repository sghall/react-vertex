import React from 'react'
import {
  useWebGLContext,
  useTexture2d,
  useUniform2fv,
} from '@react-vertex/core'
import { usePhongTextured } from '@react-vertex/material-hooks'
import { useTorusElements } from '@react-vertex/geometry-hooks'
import tilesDiffUrl from '../../public/static/textures/tiles_pink_diff.png'

const uVScale = [6.0, 1.0]

export const Torus: React.FC<{}> = React.memo(() => {
  const [texture] = useTexture2d(tilesDiffUrl)
  const program = usePhongTextured(texture, 0.15, 500)

  const gl = useWebGLContext()
  useUniform2fv(gl, program, 'uVScale', uVScale)

  const torusElements = useTorusElements(10, 1, 16, 100)

  return (
    <material program={program}>
      <geometry {...torusElements} />
    </material>
  )
})
