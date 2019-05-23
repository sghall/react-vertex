import React, { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  useWebGLContext,
  useStaticBuffer,
  useAttribute,
} from '@react-vertex/core'
import { useVector3 } from '@react-vertex/math-hooks'
import { useSphereGeometry } from '@react-vertex/geometry-hooks'
import {
  useAxesHelperProgram,
  useAxesHelperElements,
} from '@react-vertex/scene-helpers'
import { useHex } from '@react-vertex/color-hooks'
import { useSolidPhong } from '@react-vertex/material-hooks'

const sphereCount = 30
const P2 = Math.PI * 2

function Spheres({ elapsed, showAxes }) {
  const { indices, vertices, normals } = useSphereGeometry(0.75, 10, 10)

  const sphereDiffuse = useHex('#a7a7a7', true)
  const sphereProgram = useSolidPhong(sphereDiffuse, 0.15)

  const gl = useWebGLContext()

  const positionBuffer = useStaticBuffer(gl, vertices, false, 'F32')
  const position = useAttribute(gl, 3, positionBuffer)

  const normalBuffer = useStaticBuffer(gl, normals, false, 'F32')
  const normal = useAttribute(gl, 3, normalBuffer)

  const indexBuffer = useStaticBuffer(gl, indices, true, 'U16')

  const attributes = useMemo(() => {
    return { position, normal }
  }, [position, normal])

  const spheres = []

  const groupPosition = useVector3(10, 0, 0)
  const geometryPosition = useVector3(3, 0, 0)

  const axesMaterial = useAxesHelperProgram()
  const axesElements = useAxesHelperElements(10)

  for (let i = 0; i < sphereCount; i++) {
    const offset = (P2 * (i + 1)) / sphereCount

    spheres.push(
      <group key={i} rotation={[0, 0, P2 * ((i + 1) / sphereCount)]}>
        <group
          position={groupPosition}
          rotation={[0, offset + elapsed * 0.003, 0]}
        >
          {showAxes ? (
            <material program={axesMaterial}>
              <geometry {...axesElements} />
            </material>
          ) : null}
          <geometry
            position={geometryPosition}
            drawElements={{
              mode: 'TRIANGLES',
              count: indices.length,
            }}
            index={indexBuffer}
            attributes={attributes}
          />
        </group>
      </group>,
    )
  }

  return <material program={sphereProgram}>{spheres}</material>
}

Spheres.propTypes = {
  elapsed: PropTypes.number.isRequired,
  showAxes: PropTypes.bool.isRequired,
}

export default memo(Spheres)
