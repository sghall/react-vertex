import { useMemo } from 'react'

export default function useFormats(gl) {
  const memoized = useMemo(() => {
    const halfFloat = gl.getExtension('OES_texture_half_float')
    const hasLinear = !!gl.getExtension('OES_texture_half_float_linear')

    const floatType = halfFloat ? halfFloat.HALF_FLOAT_OES : gl.FLOAT

    return { floatType, hasLinear }
  }, [gl])

  return memoized
}
