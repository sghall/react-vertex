import { useReducer, useEffect } from 'react'
import { timer } from 'd3-timer'
import {
  useWebGLContext,
  useProgram,
  useStaticBuffer,
  useAttribute,
  useFrameBuffer,
  useUniform1f,
  useUniform2f,
  useDataTexture,
  useUniformSampler2d,
} from '@react-vertex/core'
import vert from './vert'
import positionFrag from './position.frag'
import { useRandomPositionData, useRandomVelocityData } from './dataHooks'

function reducer(state, action) {
  switch (action.type) {
    case 'swap':
      return state === 0 ? 1 : 0
  }
}

const vertices = [
  -0.5, +0.5, +0.0, 
  -0.5, -0.5, +0.0, 
  +0.5, -0.5, +0.0, 
  +0.5, +0.5, +0.0,
]

const indices = [0, 1, 2, 0, 2, 3]

export function usePingPong(program, size, name, ping, pong) {
  const [index, dispatch] = useReducer(reducer, 0)

  const gl = useWebGLContext()

  const frameBuffer = useFrameBuffer(gl)

  const [pingUnit, location] = useUniformSampler2d(gl, program, `${name}`, ping)
  const [pongUnit] = useUniformSampler2d(gl, program, `${name}`, pong)

  const dLocation = useUniform1f(gl, program, 'delta', 0)
  const eLocation = useUniform1f(gl, program, 'elapsed', 0)
  
  useUniform2f(gl, program, 'resolution', size, size)

  const positionsBuffer = useStaticBuffer(gl, vertices, false, 'F32')
  const position = useAttribute(gl, 3, positionsBuffer)

  const indexBuffer = useStaticBuffer(gl, indices, true, 'U16')

  useEffect(() => {
    let prevElapsed = 0
    let activeIndex = 0
  
    const timerLoop = timer(elapsed => {
      const delta = elapsed - prevElapsed
      prevElapsed = elapsed

      gl.useProgram(program)

      gl.uniform1f(dLocation, delta)
      gl.uniform1f(eLocation, elapsed)

      let texture = activeIndex === 0 ? ping : pong
      let unit = activeIndex === 0 ? pingUnit : pongUnit
      
      gl.uniform1i(location, unit)
      gl.activeTexture(gl[`TEXTURE${unit}`])
      gl.bindTexture(gl.TEXTURE_2D, texture)

      texture = activeIndex === 1 ? ping : pong
      unit = activeIndex === 1 ? pingUnit : pongUnit
      
      gl.activeTexture(gl[`TEXTURE${unit}`])
      gl.bindTexture(gl.TEXTURE_2D, texture)

      gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)

      const attach = gl.COLOR_ATTACHMENT0
      gl.framebufferTexture2D(gl.FRAMEBUFFER, attach, gl.TEXTURE_2D, texture, 0)

      const positionLocation = gl.getAttribLocation(program, 'position')
      position(positionLocation)

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0) 

      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

      activeIndex = activeIndex === 0 ? 1 : 0
      dispatch({ type: 'swap'})
    })

    return () => timerLoop.stop()
  }, [gl, ping, pingUnit, pong, location, frameBuffer, pongUnit, program, indexBuffer, position, eLocation, dLocation])

  return index === 0 ? ping : pong
}

export function useDataTextures(size) {
  const gl = useWebGLContext()
  // const velProgram = useProgram(gl, vert, positionFrag)
  const posProgram = useProgram(gl, vert, positionFrag)

  const randomVelocityData = useRandomVelocityData(size)
  const randomPositionData = useRandomPositionData(size)

  const texVelocity = useDataTexture(gl, randomVelocityData, size, size)
  // const velPong = useDataTexture(gl, randomVelocityData, size, size)
  // const texVelocity = usePingPong(velProgram, size, 'texVelocity', velPing, velPong)

  const posPing = useDataTexture(gl, randomPositionData, size, size)
  const posPong = useDataTexture(gl, randomPositionData, size, size)
  const texPosition = usePingPong(posProgram, size, 'texPosition', posPing, posPong)

  useUniformSampler2d(gl, posProgram, 'texVelocity', texVelocity)
  // useUniformSampler2d(gl, velProgram, 'texPosition', texPosition)

  return [texPosition, texVelocity]
}
