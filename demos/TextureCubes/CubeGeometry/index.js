import React, { memo, useMemo, useState, useEffect, Fragment } from 'react'
import { timer } from 'd3-timer'
import PropTypes from 'prop-types'
import {
  useWebGLContext,
  useStaticBuffer,
  useAttribute,
} from '@react-vertex/core'
import { useVector3 } from '@react-vertex/math-hooks'
import { convertHex } from '@react-vertex/color-hooks'
import { positions, uvs } from './cube.json'

const faceColors = [
  convertHex('#ff69b4'), // front
  convertHex('#e55ea2'), // back
  convertHex('#b4ff69'), // top
  convertHex('#a2e55e'), // bottom
  convertHex('#69b4ff'), // right
  convertHex('#5ea2e5'), // left
]

const colors = faceColors.reduce((acc, cur) => {
  for (let i = 0; i < 6; i++) acc = [...acc, ...cur]
  return acc
}, [])

function CubeGeometry({ offsetZ }) {
  const gl = useWebGLContext()

  const [rotation1, setRotation1] = useState([0, 0, 0])
  const [rotation2, setRotation2] = useState([0, 0, 0])

  const positionBuffer = useStaticBuffer(gl, positions, false, 'F32')
  const position = useAttribute(gl, 3, positionBuffer)

  const colorBuffer = useStaticBuffer(gl, colors, false, 'F32')
  const color = useAttribute(gl, 4, colorBuffer)

  const uvBuffer = useStaticBuffer(gl, uvs, false, 'F32')
  const uv = useAttribute(gl, 2, uvBuffer)

  // memoizing attributes here is an optimization for the renderer.
  const attributes = useMemo(() => {
    return { position, color, uv }
  }, [position, color, uv])

  // keep stable references to vectors (arrays) that are not changing
  const position1 = useVector3(+5, +5, offsetZ)
  const position2 = useVector3(-5, +5, offsetZ)
  const position3 = useVector3(+5, -5, offsetZ)
  const position4 = useVector3(-5, -5, offsetZ)

  const scale = useVector3(5, 5, 5)

  useEffect(() => {
    const timerLoop = timer(elapsed => {
      setRotation1([elapsed * 0.001, elapsed * 0.001, elapsed * 0.002])
      setRotation2([elapsed * 0.002, elapsed * 0.002, elapsed * 0.004])
    })

    return () => timerLoop.stop()
  }, [setRotation1, setRotation2])

  return (
    <Fragment>
      <geometry
        drawArrays={{
          mode: 'TRIANGLES',
          count: 36,
        }}
        scale={scale}
        rotation={rotation1}
        position={position1}
        attributes={attributes}
      />
      <geometry
        drawArrays={{
          mode: 'TRIANGLES',
          count: 36,
        }}
        scale={scale}
        rotation={rotation1}
        position={position2}
        attributes={attributes}
      />
      <geometry
        drawArrays={{
          mode: 'TRIANGLES',
          count: 36,
        }}
        scale={scale}
        rotation={rotation2}
        position={position3}
        attributes={attributes}
      />
      <geometry
        drawArrays={{
          mode: 'TRIANGLES',
          count: 36,
        }}
        scale={scale}
        rotation={rotation2}
        position={position4}
        attributes={attributes}
      />
    </Fragment>
  )
}

CubeGeometry.propTypes = {
  offsetZ: PropTypes.number.isRequired,
}

export default memo(CubeGeometry)
