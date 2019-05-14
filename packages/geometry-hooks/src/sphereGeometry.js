// Adapted from:
// https://github.com/mrdoob/three.js/blob/dev/src/geometries/SphereGeometry.js

// @author mrdoob / http://mrdoob.com/
// @author benaadams / https://twitter.com/ben_a_adams
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
export default function SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {

  radius = radius || 1

  widthSegments = Math.max(3, Math.floor(widthSegments) || 8)
  heightSegments = Math.max(2, Math.floor(heightSegments) || 6)

  phiStart = phiStart !== undefined ? phiStart : 0
  phiLength = phiLength !== undefined ? phiLength : Math.PI * 2

  thetaStart = thetaStart !== undefined ? thetaStart : 0
  thetaLength = thetaLength !== undefined ? thetaLength : Math.PI

  const thetaEnd = thetaStart + thetaLength

  let ix, iy, index = 0

  const grid = []

  const vertex = new Array(3)
  const normal = new Array(3)

  const indices = []
  const vertices = []
  const normals = []
  const uvs = []

  for (iy = 0; iy <= heightSegments; iy ++) {

    const verticesRow = []

    const v = iy / heightSegments

    const uOffset = (iy == 0) ? 0.5 / widthSegments : ((iy == heightSegments) ? - 0.5 / widthSegments : 0)

    for (ix = 0; ix <= widthSegments; ix ++) {

      const u = ix / widthSegments

      vertex[0] = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength)
      vertex[1] = radius * Math.cos(thetaStart + v * thetaLength)
      vertex[2] = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength)

      vertices.push(...vertex)

      normal[0] = vertex[0]
      normal[1] = vertex[1]
      normal[2] = vertex[2]

      const len = Math.sqrt(
        normal[0] * normal[0] +
        normal[1] * normal[1] + 
        normal[2] * normal[2]
      )
    
      normal[0] *= 1 / (len || 1)
      normal[1] *= 1 / (len || 1)
      normal[2] *= 1 / (len || 1) 

      normals.push(...normal)

      uvs.push(u + uOffset, 1 - v)
      verticesRow.push(index ++)
    }

    grid.push(verticesRow)

  }

  for (iy = 0; iy < heightSegments; iy ++) {
    for (ix = 0; ix < widthSegments; ix ++) {

      const a = grid[iy][ix + 1]
      const b = grid[iy][ix]
      const c = grid[iy + 1][ix]
      const d = grid[iy + 1][ix + 1]

      if (iy !== 0 || thetaStart > 0) indices.push(a, b, d)
      if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d)

    }

  }

  return { indices, vertices, normals, uvs }
}
