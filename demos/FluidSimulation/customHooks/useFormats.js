import { useMemo } from 'react'

export default function useFormats(gl) {
  const memoized = useMemo(() => {
    const halfFloat = gl.getExtension('OES_texture_half_float').HALF_FLOAT_OES
    const hasLinear = !!gl.getExtension('OES_texture_half_float_linear')

    return { halfFloat, hasLinear }
  }, [gl])

  return memoized
}
