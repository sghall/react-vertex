// Adapted from:
//https://github.com/mrdoob/three.js/blob/dev/src/geometries/CircleGeometry.js

// @author benaadams / https://twitter.com/ben_a_adams
// @author Mugen87 / https://github.com/Mugen87
// @author hughes

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
export default function circleGeometry(radius, segments, thetaStart, thetaLength) {
  radius = radius || 1
  segments = segments !== undefined ? Math.max(3, segments) : 8

  thetaStart = thetaStart !== undefined ? thetaStart : 0
  thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2

  const indices = []
  const vertices = []
  const normals = []
  const uvs = []

  let i, s

  const vertex = new Array(3)
  const uv = new Array(2)

  vertices.push(0, 0, 0)
  normals.push(0, 0, 1)
  uvs.push(0.5, 0.5)

  for (s = 0, i = 3; s <= segments; s++, i += 3) {
    var segment = thetaStart + (s / segments) * thetaLength

    vertex[0] = radius * Math.cos(segment)
    vertex[1] = radius * Math.sin(segment)

    vertices.push(vertex[0], vertex[1], 0)
    normals.push(0, 0, 1)
    uv[0] = (vertices[i] / radius + 1) / 2
    uv[1] = (vertices[i + 1] / radius + 1) / 2

    uvs.push(uv[0], uv[1])
  }

  for (i = 1; i <= segments; i++) {
    indices.push(i, i + 1, 0)
  }

  return { indices, vertices, normals, uvs }
}
