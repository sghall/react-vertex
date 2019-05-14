import { useMemo } from 'react'
import { vec2, vec3, vec4 } from 'gl-matrix'

export function useVector2(x, y, configure) {
  const memoized = useMemo(() => {
    const vector = vec2.create()
    vec2.set(vector, x, y)

    configure && configure(vector)

    return vector
  }, [x, y])

  return memoized
}

export function useVector3(x, y, z, configure) {
  const memoized = useMemo(() => {
    const vector = vec3.create()
    vec3.set(vector, x, y, z)

    configure && configure(vector)

    return vector
  }, [x, y, z])

  return memoized
}

export function useVector4(x, y, z, w, configure) {
  const memoized = useMemo(() => {
    const vector = vec4.create()
    vec4.set(vector, x, y, z, w)

    configure && configure(vector)

    return vector
  }, [x, y, z, w])

  return memoized
}
