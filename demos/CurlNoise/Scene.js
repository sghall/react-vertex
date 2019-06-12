import React, { memo, useEffect } from 'react'
import { timer } from 'd3-timer'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import {
  useWebGLContext,
  useTextureUnit,
  useCanvasSize,
  useRender,
} from '@react-vertex/core'
import { useSelectControl } from '@react-vertex/scene-helpers'
import useCompute from './useCompute'
import useParticleElements from './useParticleElements'
import useParticleMaterial from './useParticleMaterial'

function Scene() {
  const { width, height } = useCanvasSize()
  const renderScene = useRender()

  const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
    c.setPosition([0, 0, 50])
  })
  useOrbitControls(camera)

  const size = useSelectControl('Flock Size: ', [
    { value: 128, label: `${128 * 128} (128 x 128)` },
    { value: 256, label: `${256 * 256} (256 x 256)` },
  ])

  const compute = useCompute(size)
  const birdsMaterial = useParticleMaterial(size)
  const birdsElements = useParticleElements(size)

  const gl = useWebGLContext()
  const t1 = useTextureUnit()
  const t2 = useTextureUnit()

  useEffect(() => {
    let prevElapsed = 0

    const timerLoop = timer(e => {
      const elapsed = e * 0.005
      const delta = elapsed - prevElapsed
      prevElapsed = elapsed

      const pos = compute(elapsed, delta * 10)

      gl.useProgram(birdsMaterial.program)
      gl.uniform1i(birdsMaterial.uniforms.texPosition, pos.read.attach(t2))

      renderScene()
    })

    return () => timerLoop.stop()
  }, [gl, t1, t2, birdsMaterial, compute, renderScene])

  return (
    <camera view={camera.view} projection={camera.projection}>
      <material program={birdsMaterial.program}>
        <geometry {...birdsElements} />
      </material>
    </camera>
  )
}

Scene.propTypes = {}

export default memo(Scene)
