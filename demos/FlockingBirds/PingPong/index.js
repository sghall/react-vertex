import { useState } from 'react'
// import { timer } from 'd3-timer'
import {
  useWebGLContext,
  useProgram,
  // useStaticBuffer,
  // useAttribute,
  // useInstancedAttribute,
  // useUniform1f,
  useDataTexture,
  useUniformSampler2d,
} from '@react-vertex/core'
import vert from './vert'
import positionFrag from './position.frag'
import { useRandomPositionData, useRandomVelocityData } from './dataHooks'

export function usePingPong(program, name, ping) {
  const [texture] = useState(ping)

  // const gl = useWebGLContext()

  // const dLocation = useUniform1f(gl, program, 'delta', 0)
  // const eLocation = useUniform1f(gl, program, 'elapsed', 0)

  // const [location, unit] = useUniformSampler2d(gl, program, `${name}`, texture)

  // useEffect(() => {
  //   let last = 0
  
  //   const timerLoop = timer(elapsed => {
  //     const delta = elapsed - last
  //     last = elapsed

  //     gl.useProgram(program)

  //     dLocation && gl.uniform1i(dLocation, delta)
  //     eLocation && gl.uniform1i(eLocation, elapsed)

  //     gl.activeTexture(gl[`TEXTURE${unit}`])
  //     gl.bindTexture(gl.TEXTURE_2D, texture)
  //     gl.uniform1i(location, unit)

  //     if (texture === ping) {
  //       setTexture(pong)
  //     } else {
  //       setTexture(ping)
  //     }
  //   })

  //   return () => timerLoop.stop()
  // }, [ping, pong, gl, program, texture, location, unit, eLocation, dLocation])

  return texture
}

export function useDataTextures(size) {
  const gl = useWebGLContext()
  const velProgram = useProgram(gl, vert, positionFrag)
  const posProgram = useProgram(gl, vert, positionFrag)

  const randomVelocityData = useRandomVelocityData(size)
  const randomPositionData = useRandomPositionData(size)

  const velPing = useDataTexture(gl, randomVelocityData, size, size)
  const velPong = useDataTexture(gl, randomVelocityData, size, size)
  const texVelocity = usePingPong(posProgram, 'texVelocity', velPing, velPong)

  const posPing = useDataTexture(gl, randomPositionData, size, size)
  const posPong = useDataTexture(gl, randomPositionData, size, size)
  const texPosition = usePingPong(posProgram, 'texPosition', posPing, posPong)

  useUniformSampler2d(gl, posProgram, 'texVelocity', texVelocity)
  useUniformSampler2d(gl, velProgram, 'texPosition', texPosition)

  return [texPosition, texVelocity]
}
