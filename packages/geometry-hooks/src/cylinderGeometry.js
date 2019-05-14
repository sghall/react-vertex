// Adapted from:
// https://github.com/mrdoob/three.js/blob/dev/src/geometries/CylinderGeometry.js

// @author mrdoob / http://mrdoob.com/
// @author Mugen87 / https://github.com/Mugen87

// The MIT License
// Copyright © 2010-2019 three.js authors

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// prettier-ignore
export default function cylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
  radiusTop = radiusTop !== undefined ? radiusTop : 1
  radiusBottom = radiusBottom !== undefined ? radiusBottom : 1
  height = height || 1

  radialSegments = Math.floor(radialSegments) || 8
  heightSegments = Math.floor(heightSegments) || 1

  openEnded = openEnded !== undefined ? openEnded : false
  thetaStart = thetaStart !== undefined ? thetaStart : 0.0
  thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2

  const indices = []
  const vertices = []
  const normals = []
  const uvs = []

  let index = 0
  const indexArray = []
  const halfHeight = height / 2

  generateTorso()

  if (openEnded === false) {
    if (radiusTop > 0) generateCap(true)
    if (radiusBottom > 0) generateCap(false)
  }

  function generateTorso() {
    let x, y

    const normal = new Array(3)
    const vertex = new Array(3)

    const slope = (radiusBottom - radiusTop) / height

    for (y = 0; y <= heightSegments; y++) {
      const indexRow = []

      const v = y / heightSegments
      const radius = v * (radiusBottom - radiusTop) + radiusTop

      for (x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments

        const theta = u * thetaLength + thetaStart

        const sinTheta = Math.sin(theta)
        const cosTheta = Math.cos(theta)

        vertex[0] = radius * sinTheta
        vertex[1] = -v * height + halfHeight
        vertex[2] = radius * cosTheta
        vertices.push(...vertex)

        normal[0] = sinTheta
        normal[1] = slope
        normal[2] = cosTheta

        const len = Math.sqrt(
          normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2],
        )

        normal[0] *= 1 / (len || 1)
        normal[1] *= 1 / (len || 1)
        normal[2] *= 1 / (len || 1)

        normals.push(...normal)

        uvs.push(u, 1 - v)

        indexRow.push(index++)
      }

      indexArray.push(indexRow)
    }

    for (x = 0; x < radialSegments; x++) {
      for (y = 0; y < heightSegments; y++) {
        const a = indexArray[y][x]
        const b = indexArray[y + 1][x]
        const c = indexArray[y + 1][x + 1]
        const d = indexArray[y][x + 1]

        indices.push(a, b, d)
        indices.push(b, c, d)
      }
    }
  }

  function generateCap(top) {
    let x, centerIndexStart, centerIndexEnd

    const uv = new Array(2)
    const vertex = new Array(3)

    const radius = top === true ? radiusTop : radiusBottom
    const sign = top === true ? 1 : -1

    centerIndexStart = index

    for (x = 1; x <= radialSegments; x++) {
      vertices.push(0, halfHeight * sign, 0)
      normals.push(0, sign, 0)
      uvs.push(0.5, 0.5)

      index++
    }

    centerIndexEnd = index

    for (x = 0; x <= radialSegments; x++) {
      const u = x / radialSegments
      const theta = u * thetaLength + thetaStart

      const cosTheta = Math.cos(theta)
      const sinTheta = Math.sin(theta)

      vertex[0] = radius * sinTheta
      vertex[1] = halfHeight * sign
      vertex[2] = radius * cosTheta
      vertices.push(...vertex)

      normals.push(0, sign, 0)

      uv[0] = cosTheta * 0.5 + 0.5
      uv[1] = sinTheta * 0.5 * sign + 0.5
      uvs.push(...uv)

      index++
    }

    for (x = 0; x < radialSegments; x++) {
      const c = centerIndexStart + x
      const i = centerIndexEnd + x

      if (top === true) {
        indices.push(i, i + 1, c)
      } else {
        indices.push(i + 1, i, c)
      }
    }
  }

  return { indices, vertices, normals, uvs }
}
