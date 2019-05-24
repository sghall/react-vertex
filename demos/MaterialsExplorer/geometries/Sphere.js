import React, { memo, useMemo, useEffect } from 'react'
import { useWebGLContext, useStaticBuffer, useAttribute  } from '@react-vertex/core'
import { useSphereGeometry } from '@react-vertex/geometry-hooks'
import { useValueSlider } from '@react-vertex/scene-helpers'

function Sphere() {
  const radius = useValueSlider('Sphere Radius:', 10, 10, 20, 0.1)
  console.log('sphere')
  const gl = useWebGLContext()

  const geometry = useSphereGeometry(radius, 30, 30)
  const positionBuffer = useStaticBuffer(gl, geometry.vertices, false, 'F32')
  const position = useAttribute(gl, 3, positionBuffer)

  const normalBuffer = useStaticBuffer(gl, geometry.normals, false, 'F32')
  const normal = useAttribute(gl, 3, normalBuffer)

  const uvBuffer = useStaticBuffer(gl, geometry.uvs, false, 'F32')
  const uv = useAttribute(gl, 2, uvBuffer)

  const indexBuffer = useStaticBuffer(gl, geometry.indices, true, 'U16')

  const elements = useMemo(
    () => ({
      index: indexBuffer,
      count: geometry.indices.length,
      attributes: { position, normal, uv },
      drawElements: { mode: 'TRIANGLES', count: geometry.indices.length },
    }),
    [indexBuffer, geometry.indices.length, position, normal, uv],
  )

  useEffect(() => {
    const id = Math.random()
    console.log('sphereDidMount: ', id)
    return () => console.log('sphereUnmount: ', id)
  }, [])

  return <geometry {...elements} />
}

Sphere.propTypes = {}

export default memo(Sphere)
