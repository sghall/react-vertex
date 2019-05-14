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

export function useGeometryElements(geometry) {
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

// prettier-ignore
export function useBoxGeometry(width, height, depth, wCount, hCount, dCount) {
  const memoized = useMemo(() => {
    return boxGeometry(width, height, depth, wCount, hCount, dCount)
  }, [width, height, depth, wCount, hCount, dCount])

  return memoized
}

// prettier-ignore
export function useBoxElements(width, height, depth, wCount, hCount, dCount) {
  const geom = useBoxGeometry(width, height, depth, wCount, hCount, dCount)
  const elements = useGeometryElements(geom)

  return elements
}

// prettier-ignore
export function useCircleGeometry(radius, segments, thetaStart, thetaLength) {
  const memoized = useMemo(() => {
    return circleGeometry(radius, segments, thetaStart, thetaLength)
  }, [radius, segments, thetaStart, thetaLength])

  return memoized
}

// prettier-ignore
export function useCircleElements(radius, segments, thetaStart, thetaLength) {
  const geom = useCircleGeometry(radius, segments, thetaStart, thetaLength)
  const elements = useGeometryElements(geom)

  return elements
}

// prettier-ignore
export function useCylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
  const memoized = useMemo(() => {
    return cylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
  }, [radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength])

  return memoized
}

// prettier-ignore
export function useCylinderElements(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
  const geom = useCylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
  const elements = useGeometryElements(geom)

  return elements
}

// prettier-ignore
export function usePlaneGeometry(width, height, widthSegments, heightSegments) {
  const memoized = useMemo(() => {
    return planeGeometry(width, height, widthSegments, heightSegments)
  }, [width, height, widthSegments, heightSegments])

  return memoized
}

// prettier-ignore
export function usePlaneElements(width, height, widthSegments, heightSegments) {
  const geom = usePlaneGeometry(width, height, widthSegments, heightSegments)
  const elements = useGeometryElements(geom)

  return elements
}

// prettier-ignore
export function useTorusGeometry(radius, tube, radialSegments, tubularSegments, arc) {
  const memoized = useMemo(() => {
    return torusGeometry(radius, tube, radialSegments, tubularSegments, arc)
  }, [radius, tube, radialSegments, tubularSegments, arc])

  return memoized
}

// prettier-ignore
export function useTorusElements(radius, tube, radialSegments, tubularSegments, arc) {
  const geom = useTorusGeometry(radius, tube, radialSegments, tubularSegments, arc)
  const elements = useGeometryElements(geom)

  return elements
}

// prettier-ignore
export function useSphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
  const memoized = useMemo(() => {
    return sphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
  }, [radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength])

  return memoized
}

// prettier-ignore
export function useSphereElements(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
  const geom = useSphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
  const elements = useGeometryElements(geom)

  return elements
}
