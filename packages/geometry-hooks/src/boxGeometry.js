// Adapted from:
//https://github.com/mrdoob/three.js/blob/dev/src/geometries/BoxGeometry.js

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
export default function boxGeometry(width = 1, height = 1, depth = 1, wCount, hCount, dCount) {
  wCount = Math.floor(wCount) || 1
  hCount = Math.floor(hCount) || 1
  dCount = Math.floor(dCount) || 1

  const indices = []
  const vertices = []
  const normals = []
  const uvs = []

  let numberOfVertices = 0

  buildPlane(2, 1, 0, -1, -1, depth, height, +width, dCount, hCount, 0)
  buildPlane(2, 1, 0, +1, -1, depth, height, -width, dCount, hCount, 1)
  buildPlane(0, 2, 1, +1, +1, width, depth, +height, wCount, dCount, 2)
  buildPlane(0, 2, 1, +1, -1, width, depth, -height, wCount, dCount, 3)
  buildPlane(0, 1, 2, +1, -1, width, height, +depth, wCount, hCount, 4)
  buildPlane(0, 1, 2, -1, -1, width, height, -depth, wCount, hCount, 5)

  function buildPlane(u, v, w, udir, vdir, width, height, depth, gridX, gridY) {
    const segmentWidth = width / gridX
    const segmentHeight = height / gridY

    const widthHalf = width / 2
    const heightHalf = height / 2
    const depthHalf = depth / 2

    const gridX1 = gridX + 1
    const gridY1 = gridY + 1

    let vertexCounter = 0

    let ix, iy

    const vector = new Array(3)

    for (iy = 0; iy < gridY1; iy++) {
      var y = iy * segmentHeight - heightHalf

      for (ix = 0; ix < gridX1; ix++) {
        var x = ix * segmentWidth - widthHalf

        vector[u] = x * udir
        vector[v] = y * vdir
        vector[w] = depthHalf

        vertices.push(...vector)

        vector[u] = 0
        vector[v] = 0
        vector[w] = depth > 0 ? 1 : -1

        normals.push(...vector)

        uvs.push(ix / gridX)
        uvs.push(1 - iy / gridY)

        vertexCounter += 1
      }
    }

    for (iy = 0; iy < gridY; iy++) {
      for (ix = 0; ix < gridX; ix++) {
        var a = numberOfVertices + ix + gridX1 * iy
        var b = numberOfVertices + ix + gridX1 * (iy + 1)
        var c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1)
        var d = numberOfVertices + (ix + 1) + gridX1 * iy

        indices.push(a, b, d)
        indices.push(b, c, d)
      }
    }

    numberOfVertices += vertexCounter
  }

  return { indices, vertices, normals, uvs }
}
