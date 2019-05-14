// Adapted from:
// https://github.com/mrdoob/three.js/blob/dev/src/geometries/PlaneGeometry.js

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
export default function PlaneBufferGeometry(width, height, widthSegments, heightSegments) {
  width = width || 1
  height = height || 1

  const width_half = width / 2
  const height_half = height / 2

  const gridX = Math.floor(widthSegments) || 1
  const gridY = Math.floor(heightSegments) || 1

  const gridX1 = gridX + 1
  const gridY1 = gridY + 1

  const segment_width = width / gridX
  const segment_height = height / gridY

  let ix, iy

  const indices = []
  const vertices = []
  const normals = []
  const uvs = []

  for (iy = 0; iy < gridY1; iy++) {
    const y = iy * segment_height - height_half

    for (ix = 0; ix < gridX1; ix++) {
      const x = ix * segment_width - width_half

      vertices.push(x, -y, 0)
      normals.push(0, 0, 1)

      uvs.push(ix / gridX)
      uvs.push(1 - iy / gridY)
    }
  }

  for (iy = 0; iy < gridY; iy++) {
    for (ix = 0; ix < gridX; ix++) {
      const a = ix + gridX1 * iy
      const b = ix + gridX1 * (iy + 1)
      const c = ix + 1 + gridX1 * (iy + 1)
      const d = ix + 1 + gridX1 * iy

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  return { indices, vertices, normals, uvs }
}
