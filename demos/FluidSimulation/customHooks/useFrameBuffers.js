import { useMemo } from 'react'
import { useFBO, useDoubleFBO } from '@react-vertex/core'

function useFrameBuffers(gl, dyeSize, simSize, floatType, minMag) {
  const getOptsIfLinear = () => ({ type: floatType, minMag })
  const getOptsUseNearest = () => ({ type: floatType, minMag: gl.NEAREST })

  const curlFBO = useFBO(gl, ...simSize, getOptsUseNearest)
  const divergenceFBO = useFBO(gl, ...simSize, getOptsUseNearest)
  const densityDFBO = useDoubleFBO(gl, ...dyeSize, getOptsIfLinear)
  const pressureDFBO = useDoubleFBO(gl, ...simSize, getOptsUseNearest)
  const velocityDFBO = useDoubleFBO(gl, ...simSize, getOptsIfLinear)

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

export default useFrameBuffers
