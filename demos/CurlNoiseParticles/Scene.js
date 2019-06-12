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
import useParticleElements from './useParticleElements'
import useParticleMaterial from './useParticleMaterial'

function Scene() {
  const { width, height } = useCanvasSize()
  const renderScene = useRender()

  const camera = useOrbitCamera(65, width / height, 1, 500, c => {
    c.setPosition([0, 0, 6])
  })
  useOrbitControls(camera)

  const size = 256
  const compute = useCompute(size)
  const particleMaterial = useParticleMaterial(size)
  const particleElements = useParticleElements(size)

  const gl = useWebGLContext()
  const texUnit = useTextureUnit()

  useEffect(() => {
    let prevElapsed = 0
    let flipped = 0

    const timerLoop = timer(e => {
      const elapsed = e * 0.005
      const delta = elapsed - prevElapsed
      prevElapsed = elapsed

      gl.useProgram(particleMaterial.program)
      gl.uniform1f(particleMaterial.uniforms.flipped, flipped)

      const pos = compute(elapsed, delta * 10)
      gl.uniform1i(
        particleMaterial.uniforms.texPosition,
        pos.read.attach(texUnit),
      )

      renderScene()

      flipped = flipped === 0 ? 1 : 0
    })

    return () => timerLoop.stop()
  }, [gl, texUnit, particleMaterial, compute, renderScene])

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
