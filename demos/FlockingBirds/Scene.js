import React, { memo, useEffect } from 'react'
import { timer } from 'd3-timer'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import {
  useWebGLContext,
  useTextureUnit,
  useCanvasSize,
  useRender,
} from '@react-vertex/core'
import useCompute from './useCompute'
import useBirdsElements from './useBirdsElements'
import useBirdsMaterial from './useBirdsMaterial'

const size = 32

function Scene() {
  const { width, height } = useCanvasSize()
  const renderScene = useRender()

  const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
    c.setPosition([0, 0, 500])
  })
  useOrbitControls(camera)

  const compute = useCompute(size)
  const birdsMaterial = useBirdsMaterial(size)
  const birdsElements = useBirdsElements(size)

  const gl = useWebGLContext()
  const t1 = useTextureUnit()
  const t2 = useTextureUnit()

  useEffect(() => {
    let prevElapsed = 0

    const timerLoop = timer(e => {
      const elapsed = e * 0.0005
      const delta = elapsed - prevElapsed
      prevElapsed = elapsed

      const [pos, vel] = compute(elapsed, delta)

      gl.useProgram(birdsMaterial.program)
      gl.uniform1i(birdsMaterial.uniforms.texPosition, pos.read.attach(t2))
      gl.uniform1i(birdsMaterial.uniforms.texVelocity, vel.read.attach(t1))

      renderScene()
    })

    return () => timerLoop.stop()
  }, [gl, t1, t2, birdsMaterial, compute, renderScene])

  return (
    <camera view={camera.view} projection={camera.projection}>
      <material program={birdsMaterial.program}>
        <instancedgeometry {...birdsElements} />
      </material>
    </camera>
  )
}

Scene.propTypes = {}

export default memo(Scene)
