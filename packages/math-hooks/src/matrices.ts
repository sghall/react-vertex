import { useMemo } from 'react'
import { mat4 } from 'gl-matrix'

export function usePerspectiveMatrix(
  fov: number,
  aspect: number,
  near: number = 1,
  far: number = 1000,
  configure?: (m: mat4) => void,
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

export function useIdentityMatrix(
  px: number = 0,
  py: number = 0,
  pz: number = 0,
  configure?: (m: mat4) => void,
) {
  const memoized = useMemo(() => {
    const matrix = mat4.create()
    mat4.translate(matrix, matrix, [px, py, pz])

    configure && configure(matrix)

    return matrix
  }, [px, py, pz])

  return memoized
}

export function useInvertedMatrix(
  px: number = 0,
  py: number = 0,
  pz: number = 0,
  configure?: (m: mat4) => void,
) {
  const memoized = useMemo(() => {
    const matrix = mat4.create()
    mat4.translate(matrix, matrix, [px, py, pz])
    mat4.invert(matrix, matrix)

    configure && configure(matrix)

    return matrix
  }, [px, py, pz])

  return memoized
}
