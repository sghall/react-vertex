import { useMemo } from 'react'
import {
  useWebGLContext,
  useProgram,
  useTextureUnit,
  useProgramUniforms,
  useDataTexture,
  useDoubleFBO,
} from '@react-vertex/core'
import vert from './vert'
import positionFrag from './position.frag'
import velocityFrag from './velocity.frag'
import { useRandomPositionData, useRandomVelocityData } from './dataHooks'

function useFormats(gl) {
  const memoized = useMemo(() => {
    const halfFloat = gl.getExtension('OES_texture_half_float')
    const hasLinear = !!gl.getExtension('OES_texture_half_float_linear')

    const floatType = halfFloat ? halfFloat.HALF_FLOAT_OES : gl.FLOAT

    return { floatType, hasLinear }
  }, [gl])

  return memoized
}

export default function useCompute(size) {
  const gl = useWebGLContext()
  const { floatType, hasLinear } = useFormats(gl)
  const getTexOpts = () => {
    return { type: floatType, minMag: hasLinear ? gl.LINEAR : gl.NEAREST }
  }

  const texUnit1 = useTextureUnit()
  const texUnit2 = useTextureUnit()

  const posProgram = useProgram(gl, vert, positionFrag)
  const posUniforms = useProgramUniforms(gl, posProgram)

  const velProgram = useProgram(gl, vert, velocityFrag)
  const velUniforms = useProgramUniforms(gl, velProgram)

  const randomVelocityData = useRandomVelocityData(size)
  const randomPositionData = useRandomPositionData(size)

  const posInitial = useDataTexture(gl, randomPositionData, size, size)
  const velInitial = useDataTexture(gl, randomVelocityData, size, size)

  const velocityDFBO = useDoubleFBO(gl, size, size, getTexOpts)
  const positionDFBO = useDoubleFBO(gl, size, size, getTexOpts)

  const memoized = useMemo(() => {
    let isInitialRender = true

    const renderToBuffer = (() => {
      // prettier-ignore
      const verts = new Float32Array([
        -1.0, +1.0, +0.0, 
        -1.0, -1.0, +0.0, 
        +1.0, -1.0, +0.0, 
        +1.0, +1.0, +0.0,
      ])
      const index = new Uint16Array([0, 1, 2, 0, 2, 3])
      const vertsBuffer = gl.createBuffer()
      const indexBuffer = gl.createBuffer()

      return buffer => {
        gl.bindBuffer(gl.ARRAY_BUFFER, vertsBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW)
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(0)

        gl.bindFramebuffer(gl.FRAMEBUFFER, buffer)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      }
    })()

    function compute(elapsed, delta) {
      gl.viewport(0, 0, size, size)

      // **********************************************
      // POSTION
      // **********************************************
      gl.useProgram(posProgram)

      gl.uniform2f(posUniforms.resolution, size, size)
      gl.uniform1f(posUniforms.delta, delta * 0.5)
      gl.uniform1f(posUniforms.elapsed, elapsed)

      if (isInitialRender) {
        gl.activeTexture(gl.TEXTURE0 + texUnit2)
        gl.bindTexture(gl.TEXTURE_2D, velInitial)
        gl.uniform1i(posUniforms.texVelocity, texUnit2)

        gl.activeTexture(gl.TEXTURE0 + texUnit1)
        gl.bindTexture(gl.TEXTURE_2D, posInitial)
        gl.uniform1i(posUniforms.texPosition, texUnit1)
      } else {
        positionDFBO.read.attach(texUnit1)
        velocityDFBO.read.attach(texUnit2)
        gl.uniform1i(posUniforms.texPosition, texUnit1)
        gl.uniform1i(posUniforms.texVelocity, texUnit2)
      }

      renderToBuffer(positionDFBO.write.fbo)
      positionDFBO.swap()

      // **********************************************
      // VELOCITY
      // **********************************************
      gl.useProgram(velProgram)

      gl.uniform2f(velUniforms.resolution, size, size)
      gl.uniform1f(velUniforms.delta, delta * 0.5)
      gl.uniform1f(velUniforms.elapsed, elapsed)

      if (isInitialRender) {
        gl.activeTexture(gl.TEXTURE0 + texUnit2)
        gl.bindTexture(gl.TEXTURE_2D, posInitial)
        gl.uniform1i(velUniforms.texPosition, texUnit2)

        gl.activeTexture(gl.TEXTURE0 + texUnit1)
        gl.bindTexture(gl.TEXTURE_2D, velInitial)
        gl.uniform1i(velUniforms.texVelocity, texUnit1)

        isInitialRender = false
      } else {
        velocityDFBO.read.attach(texUnit1)
        positionDFBO.read.attach(texUnit2)
        gl.uniform1i(velUniforms.texVelocity, texUnit1)
        gl.uniform1i(velUniforms.texPosition, texUnit2)
      }

      renderToBuffer(velocityDFBO.write.fbo)
      velocityDFBO.swap()

      return [positionDFBO, velocityDFBO]
    }

    compute(0, 0)

    return compute
  }, [
    gl,
    size,
    texUnit1,
    texUnit2,
    positionDFBO,
    posInitial,
    posProgram,
    posUniforms,
    velocityDFBO,
    velInitial,
    velProgram,
    velUniforms,
  ])

  return memoized
}
