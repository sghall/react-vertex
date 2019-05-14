import React, { useState, useEffect } from 'react'
import { timer } from 'd3-timer'
import { useRender } from '@react-vertex/core'
import {
  useInvertedMatrix,
  usePerspectiveMatrix,
} from '@react-vertex/math-hooks'
import CubeMaterial from './CubeMaterial'
import CubeGeometry from './CubeGeometry'
import tex1Url from 'static/textures/react-vertex-white.png'
import tex2Url from 'static/textures/grey-noise.png'

function Scene() {
  const view = useInvertedMatrix(0, 0, 50)
  const projection = usePerspectiveMatrix(35, 1.0, 0.1, 1000)

  const [groupRotation, setGroupRotation] = useState([0, 0, 0])

  const renderScene = useRender()

  useEffect(() => {
    const timerLoop = timer(elapsed => {
      renderScene()
      setGroupRotation([elapsed * 0.0004, elapsed * 0.0003, elapsed * 0.0003])
    })

    return () => timerLoop.stop()
  }, [renderScene])

  return (
    <camera camera={{ view, projection }}>
      <group rotation={groupRotation}>
        <CubeMaterial textureUnit={0} textureUrl={tex1Url}>
          <CubeGeometry offsetZ={+5} />
        </CubeMaterial>
        <CubeMaterial textureUnit={1} textureUrl={tex2Url}>
          <CubeGeometry offsetZ={-5} />
        </CubeMaterial>
      </group>
    </camera>
  )
}

export default Scene
