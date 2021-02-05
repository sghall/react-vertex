import { useMemo, useEffect } from 'react'
import { useCanvas } from '@react-vertex/core'
import { OrbitCamera } from './OrbitCamera'
import { OrbitControls } from './OrbitControls'

export { OrbitCamera } from './OrbitCamera'
export { OrbitControls } from './OrbitControls'

export function useOrbitCamera(
  fov: number,
  aspect: number,
  near: number = 1,
  far: number = 1000,
  configure: (c: OrbitCamera) => void,
) {
  const memoized = useMemo(() => {
    const camera = new OrbitCamera(fov, aspect, near, far)

    configure && configure(camera)

    return camera
  }, [])

  useMemo(() => {
    memoized.setProjection(fov, aspect, near, far)
  }, [memoized, fov, aspect, near, far])

  return memoized
}

export function useOrbitControls(
  camera: OrbitCamera,
  configure: (c: OrbitControls) => void,
) {
  const canvas = useCanvas()

  const memoized = useMemo(() => {
    const controls = new OrbitControls(camera, canvas)

    configure && configure(controls)

    return controls
  }, [camera, canvas])

  useEffect(() => {
    canvas.addEventListener('mousedown', memoized.onMouseDown, false)
    canvas.addEventListener('mouseup', memoized.onMouseUp, false)
    canvas.addEventListener('mousemove', memoized.onMouseMove, false)
    canvas.addEventListener('touchstart', memoized.onTouchStart, false)
    canvas.addEventListener('touchend', memoized.onTouchEnd, false)
    canvas.addEventListener('touchmove', memoized.onTouchMove, false)
    canvas.addEventListener('wheel', memoized.onMouseWheel, false)

    return () => {
      canvas.removeEventListener('mousedown', memoized.onMouseDown, false)
      canvas.removeEventListener('mouseup', memoized.onMouseUp, false)
      canvas.removeEventListener('mousemove', memoized.onMouseMove, false)
      canvas.removeEventListener('touchstart', memoized.onTouchStart, false)
      canvas.removeEventListener('touchend', memoized.onTouchEnd, false)
      canvas.removeEventListener('touchmove', memoized.onTouchMove, false)
      canvas.removeEventListener('wheel', memoized.onMouseWheel, false)
    }
  }, [canvas, memoized])

  return memoized
}
