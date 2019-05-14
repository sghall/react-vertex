import { useMemo } from 'react'
import { mat4 } from 'gl-matrix'

export function usePerspectiveMatrix(
  fov,
  aspect,
  near = 1,
  far = 1000,
  configure,
) {
  const memoized = useMemo(() => {
    const matrix = mat4.create()

    const radians = (fov * Math.PI) / 180
    mat4.perspective(matrix, radians, aspect, near, far)

    configure && configure(matrix)

    return matrix
  }, [fov, aspect, near, far])

  return memoized
}

export function useIdentityMatrix(px = 0, py = 0, pz = 0, configure) {
  const memoized = useMemo(() => {
    const matrix = mat4.create()
    mat4.translate(matrix, matrix, [px, py, pz])

    configure && configure(matrix)

    return matrix
  }, [px, py, pz])

  return memoized
}

export function useInvertedMatrix(px = 0, py = 0, pz = 0, configure) {
  const memoized = useMemo(() => {
    const matrix = mat4.create()
    mat4.translate(matrix, matrix, [px, py, pz])
    mat4.invert(matrix, matrix)

    configure && configure(matrix)

    return matrix
  }, [px, py, pz])

  return memoized
}
