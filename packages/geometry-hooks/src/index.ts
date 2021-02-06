import { useMemo } from 'react'
import {
  useStaticBuffer,
  useAttribute,
  useWebGLContext,
} from '@react-vertex/core'
import boxGeometry from './boxGeometry'
import circleGeometry from './circleGeometry'
import cylinderGeometry from './cylinderGeometry'
import planeGeometry from './planeGeometry'
import torusGeometry from './torusGeometry'
import sphereGeometry from './sphereGeometry'

export {
  boxGeometry,
  circleGeometry,
  cylinderGeometry,
  planeGeometry,
  torusGeometry,
  sphereGeometry,
}

export function useGeometryElements(geometry: {
  vertices: number[]
  normals: number[]
  uvs: number[]
  indices: number[]
}) {
  const gl = useWebGLContext()

  const positionBuffer = useStaticBuffer(gl, geometry.vertices, false, 'F32')
  const position = useAttribute(gl, 3, positionBuffer)

  const normalBuffer = useStaticBuffer(gl, geometry.normals, false, 'F32')
  const normal = useAttribute(gl, 3, normalBuffer)

  const uvBuffer = useStaticBuffer(gl, geometry.uvs, false, 'F32')
  const uv = useAttribute(gl, 2, uvBuffer)

  const indexBuffer = useStaticBuffer(gl, geometry.indices, true, 'U16')

  const elements = useMemo(
    () => ({
      index: indexBuffer,
      count: geometry.indices.length,
      attributes: { position, normal, uv },
      drawElements: { mode: 'TRIANGLES', count: geometry.indices.length },
    }),
    [indexBuffer, geometry.indices.length, position, normal, uv],
  )

  return elements
}

export function useBoxGeometry(
  width?: number,
  height?: number,
  depth?: number,
  wCount?: number,
  hCount?: number,
  dCount?: number,
) {
  const memoized = useMemo(() => {
    return boxGeometry(width, height, depth, wCount, hCount, dCount)
  }, [width, height, depth, wCount, hCount, dCount])

  return memoized
}

export function useBoxElements(
  width?: number,
  height?: number,
  depth?: number,
  wCount?: number,
  hCount?: number,
  dCount?: number,
) {
  const geom = useBoxGeometry(width, height, depth, wCount, hCount, dCount)
  const elements = useGeometryElements(geom)

  return elements
}

export function useCircleGeometry(
  radius?: number,
  segments?: number,
  thetaStart?: number,
  thetaLength?: number,
) {
  const memoized = useMemo(() => {
    return circleGeometry(radius, segments, thetaStart, thetaLength)
  }, [radius, segments, thetaStart, thetaLength])

  return memoized
}

export function useCircleElements(
  radius?: number,
  segments?: number,
  thetaStart?: number,
  thetaLength?: number,
) {
  const geom = useCircleGeometry(radius, segments, thetaStart, thetaLength)
  const elements = useGeometryElements(geom)

  return elements
}

export function useCylinderGeometry(
  radiusTop?: number,
  radiusBottom?: number,
  height?: number,
  radialSegments?: number,
  heightSegments?: number,
  openEnded?: boolean,
  thetaStart?: number,
  thetaLength?: number,
) {
  const memoized = useMemo(() => {
    return cylinderGeometry(
      radiusTop,
      radiusBottom,
      height,
      radialSegments,
      heightSegments,
      openEnded,
      thetaStart,
      thetaLength,
    )
  }, [
    radiusTop,
    radiusBottom,
    height,
    radialSegments,
    heightSegments,
    openEnded,
    thetaStart,
    thetaLength,
  ])

  return memoized
}

export function useCylinderElements(
  radiusTop?: number,
  radiusBottom?: number,
  height?: number,
  radialSegments?: number,
  heightSegments?: number,
  openEnded?: boolean,
  thetaStart?: number,
  thetaLength?: number,
) {
  const geom = useCylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    radialSegments,
    heightSegments,
    openEnded,
    thetaStart,
    thetaLength,
  )
  const elements = useGeometryElements(geom)

  return elements
}

export function usePlaneGeometry(
  width?: number,
  height?: number,
  widthSegments?: number,
  heightSegments?: number,
) {
  const memoized = useMemo(() => {
    return planeGeometry(width, height, widthSegments, heightSegments)
  }, [width, height, widthSegments, heightSegments])

  return memoized
}

export function usePlaneElements(
  width?: number,
  height?: number,
  widthSegments?: number,
  heightSegments?: number,
) {
  const geom = usePlaneGeometry(width, height, widthSegments, heightSegments)
  const elements = useGeometryElements(geom)

  return elements
}

export function useTorusGeometry(
  radius?: number,
  tube?: number,
  radialSegments?: number,
  tubularSegments?: number,
  arc?: number,
) {
  const memoized = useMemo(() => {
    return torusGeometry(radius, tube, radialSegments, tubularSegments, arc)
  }, [radius, tube, radialSegments, tubularSegments, arc])

  return memoized
}

export function useTorusElements(
  radius?: number,
  tube?: number,
  radialSegments?: number,
  tubularSegments?: number,
  arc?: number,
) {
  const geom = useTorusGeometry(
    radius,
    tube,
    radialSegments,
    tubularSegments,
    arc,
  )
  const elements = useGeometryElements(geom)

  return elements
}

export function useSphereGeometry(
  radius?: number,
  widthSegments?: number,
  heightSegments?: number,
  phiStart?: number,
  phiLength?: number,
  thetaStart?: number,
  thetaLength?: number,
) {
  const memoized = useMemo(() => {
    return sphereGeometry(
      radius,
      widthSegments,
      heightSegments,
      phiStart,
      phiLength,
      thetaStart,
      thetaLength,
    )
  }, [
    radius,
    widthSegments,
    heightSegments,
    phiStart,
    phiLength,
    thetaStart,
    thetaLength,
  ])

  return memoized
}

export function useSphereElements(
  radius?: number,
  widthSegments?: number,
  heightSegments?: number,
  phiStart?: number,
  phiLength?: number,
  thetaStart?: number,
  thetaLength?: number,
) {
  const geom = useSphereGeometry(
    radius,
    widthSegments,
    heightSegments,
    phiStart,
    phiLength,
    thetaStart,
    thetaLength,
  )
  const elements = useGeometryElements(geom)

  return elements
}
