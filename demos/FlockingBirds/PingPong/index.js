import { useReducer, useEffect, useMemo } from 'react'
import { timer } from 'd3-timer'
import {
  useWebGLContext,
  useProgram,
  useStaticBuffer,
  useAttribute,
  useFrameBuffer,
  useDataTexture,
  useSceneNode,
} from '@react-vertex/core'
import vert from './vert'
import positionFrag from './position.frag'
import velocityFrag from './velocity.frag'
import { useRandomPositionData, useRandomVelocityData } from './dataHooks'

function reducer(state, action) {
  switch (action.type) {
    case 'swap':
      return state === 0 ? 1 : 0
  }
}

// prettier-ignore
const vertices = [
  -1.0, +1.0, +0.0, 
  -1.0, -1.0, +0.0, 
  +1.0, -1.0, +0.0, 
  +1.0, +1.0, +0.0,
]

const indices = [0, 1, 2, 0, 2, 3]

export function usePingPong(program, size, name, ping, pong) {
  const [index, dispatch] = useReducer(reducer, 0)

  const gl = useWebGLContext()

  const scene = useSceneNode()
  const frameBuffer = useFrameBuffer(gl)

  const positionsBuffer = useStaticBuffer(gl, vertices, false, 'F32')
  const position = useAttribute(gl, 3, positionsBuffer)

  const indexBuffer = useStaticBuffer(gl, indices, true, 'U16')

  useEffect(() => {
    const pingUnit = scene.getTextureUnit()
    const pongUnit = scene.getTextureUnit()

    const tLocation = gl.getUniformLocation(program, name)
    const pLocation = gl.getAttribLocation(program, 'position')
    const eLocation = gl.getUniformLocation(program, 'elapsed')
    const dLocation = gl.getUniformLocation(program, 'delta')
    const rLocation = gl.getUniformLocation(program, 'resolution')

    let prevElapsed = 0
    let activeIndex = 0

    const timerLoop = timer(e => {
      const elapsed = e * 0.001
      const delta = elapsed - prevElapsed
      prevElapsed = elapsed

      gl.useProgram(program)

      gl.uniform2f(rLocation, size, size)
      gl.uniform1f(dLocation, delta * 0.5)
      gl.uniform1f(eLocation, elapsed)

      if (activeIndex === 0) {
        gl.activeTexture(gl[`TEXTURE${pongUnit}`])
        gl.bindTexture(gl.TEXTURE_2D, pong)

        const attach = gl.COLOR_ATTACHMENT0
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attach, gl.TEXTURE_2D, pong, 0)

        gl.activeTexture(gl[`TEXTURE${pingUnit}`])
        gl.bindTexture(gl.TEXTURE_2D, ping)
        gl.uniform1i(tLocation, pingUnit)
      } else {
        gl.activeTexture(gl[`TEXTURE${pingUnit}`])
        gl.bindTexture(gl.TEXTURE_2D, ping)

        const attach = gl.COLOR_ATTACHMENT0
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attach, gl.TEXTURE_2D, ping, 0)

        gl.activeTexture(gl[`TEXTURE${pongUnit}`])
        gl.bindTexture(gl.TEXTURE_2D, pong)
        gl.uniform1i(tLocation, pongUnit)
      }

      position(pLocation)

      gl.viewport(0, 0, size, size)

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)

      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

      activeIndex = activeIndex === 0 ? 1 : 0
      dispatch({ type: 'swap' })
    })

    return () => {
      timerLoop.stop()
      scene.releaseTextureUnit(pingUnit)
      scene.releaseTextureUnit(pongUnit)
    }
  }, [
    gl,
    scene,
    name,
    size,
    ping,
    pong,
    program,
    position,
    indexBuffer,
    frameBuffer,
  ])

  return index === 0 ? ping : pong
}

export function useDataTextures(size) {
  const gl = useWebGLContext()
  const scene = useSceneNode()

  const velProgram = useProgram(gl, vert, velocityFrag)
  const posProgram = useProgram(gl, vert, positionFrag)

  const deps = useMemo(() => {
    const velUnit = scene.getTextureUnit()
    const velLocation = gl.getUniformLocation(posProgram, 'texVelocity')

    const posUnit = scene.getTextureUnit()
    const posLocation = gl.getUniformLocation(velProgram, 'texPosition')

    return { velUnit, velLocation, posUnit, posLocation }
  }, [gl, scene, posProgram, velProgram])

  const randomVelocityData = useRandomVelocityData(size)
  const randomPositionData = useRandomPositionData(size)

  const velPing = useDataTexture(gl, randomVelocityData, size, size)
  const velPong = useDataTexture(gl, randomVelocityData, size, size)

  const texVelocity = usePingPong(
    velProgram,
    size,
    'texVelocity',
    velPing,
    velPong,
  )

  const posPing = useDataTexture(gl, randomPositionData, size, size)
  const posPong = useDataTexture(gl, randomPositionData, size, size)

  const texPosition = usePingPong(
    posProgram,
    size,
    'texPosition',
    posPing,
    posPong,
  )

  gl.useProgram(posProgram)
  gl.activeTexture(gl[`TEXTURE${deps.velUnit}`])
  gl.bindTexture(gl.TEXTURE_2D, texVelocity)
  gl.uniform1i(deps.velLocation, deps.velUnit)

  gl.useProgram(velProgram)
  gl.activeTexture(gl[`TEXTURE${deps.posUnit}`])
  gl.bindTexture(gl.TEXTURE_2D, texPosition)
  gl.uniform1i(deps.posLocation, deps.posUnit)

  return [texPosition, texVelocity]
}
