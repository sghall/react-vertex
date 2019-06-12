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

  const camera = useOrbitCamera(55, width / height, 1, 500, c => {
    c.setPosition([0, 0, 10])
  })
  useOrbitControls(camera)

  // const size = 4
  const size = useSelectControl('Flock Size: ', [
    { value: 256, label: `${256 * 256} (256 x 256)` },
    { value: 512, label: `${512 * 512} (512 x 512)` },
  ])

  const compute = useCompute(size)
  const particleMaterial = useParticleMaterial(size)
  const particleElements = useParticleElements(size)

  const gl = useWebGLContext()
  const t1 = useTextureUnit()
  const t2 = useTextureUnit()

  useEffect(() => {
    let prevElapsed = 0
    let flipped = 0

    const timerLoop = timer(e => {
      const elapsed = e * 0.005
      const delta = elapsed - prevElapsed
      prevElapsed = elapsed

      const pos = compute(elapsed, delta * 10)

      gl.useProgram(particleMaterial.program)
      gl.uniform1f(particleMaterial.uniforms.flipped, flipped)
      gl.uniform1i(particleMaterial.uniforms.texPosition, pos.read.attach(t2))

      renderScene()

      flipped = flipped === 0 ? 1 : 0
    })

    return () => timerLoop.stop()
  }, [gl, t1, t2, particleMaterial, compute, renderScene])

  return (
    <camera view={camera.view} projection={camera.projection}>
      <material program={particleMaterial.program}>
        <geometry {...particleElements} />
      </material>
    </camera>
  )
}

Scene.propTypes = {}

export default memo(Scene)
