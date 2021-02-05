import { useMemo } from 'react'
import { useFBO, useDoubleFBO } from '@react-vertex/core'

function useFramebuffers(gl, dyeSize, simSize, formats) {
  const { R, RG, RGBA, halfFloat, hasLinear } = formats

  const getOptsRFormat = () => ({
    type: halfFloat,
    minMag: gl.NEAREST,
    format: R.format,
    internalFormat: R.internalFormat,
  })

  const getOptsRGFormat = () => ({
    type: halfFloat,
    minMag: hasLinear ? gl.LINEAR : gl.NEAREST,
    format: RG.format,
    internalFormat: RG.internalFormat,
  })

  const getOptsRGBAFormat = () => ({
    type: halfFloat,
    minMag: hasLinear ? gl.LINEAR : gl.NEAREST,
    format: RGBA.format,
    internalFormat: RGBA.internalFormat,
  })

  const curlFBO = useFBO(gl, ...simSize, getOptsRFormat)
  const divergenceFBO = useFBO(gl, ...simSize, getOptsRFormat)
  const densityDFBO = useDoubleFBO(gl, ...dyeSize, getOptsRGBAFormat)
  const pressureDFBO = useDoubleFBO(gl, ...simSize, getOptsRFormat)
  const velocityDFBO = useDoubleFBO(gl, ...simSize, getOptsRGFormat)

  const memoized = useMemo(() => {
    return {
      curlFBO,
      divergenceFBO,
      densityDFBO,
      pressureDFBO,
      velocityDFBO,
    }
  }, [curlFBO, divergenceFBO, densityDFBO, pressureDFBO, velocityDFBO])

  return memoized
}

export default useFramebuffers
