// Adapted from:
// https://github.com/mrdoob/three.js/blob/dev/src/geometries/TorusGeometry.js

// @author oosmoxiecode
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
export default function torusGeometry(radius, tube, radialSegments, tubularSegments, arc) {
  radius = radius || 1
  tube = tube || 0.4
  radialSegments = Math.floor(radialSegments) || 8
  tubularSegments = Math.floor(tubularSegments) || 6
  arc = arc || Math.PI * 2

  const indices = []
  const vertices = []
  const normals = []
  const uvs = []

  const center = new Array(3)
  const vertex = new Array(3)
  const normal = new Array(3)

  let j, i

  for (j = 0; j <= radialSegments; j++) {
    for (i = 0; i <= tubularSegments; i++) {
      const u = (i / tubularSegments) * arc
      const v = (j / radialSegments) * Math.PI * 2

      vertex[0] = (radius + tube * Math.cos(v)) * Math.cos(u)
      vertex[1] = (radius + tube * Math.cos(v)) * Math.sin(u)
      vertex[2] = tube * Math.sin(v)

      vertices.push(...vertex)

      center[0] = radius * Math.cos(u)
      center[1] = radius * Math.sin(u)
      center[2] = 0

      normal[0] = vertex[0] - center[0]
      normal[1] = vertex[1] - center[1]
      normal[2] = vertex[2] - center[2]

      const len = Math.sqrt(
        normal[0] * normal[0] +
        normal[1] * normal[1] + 
        normal[2] * normal[2]
      )
    
      normal[0] *= 1 / (len || 1)
      normal[1] *= 1 / (len || 1)
      normal[2] *= 1 / (len || 1) 

      normals.push(...normal)

      uvs.push(i / tubularSegments)
      uvs.push(j / radialSegments)
    }
  }

  for (j = 1; j <= radialSegments; j++) {
    for (i = 1; i <= tubularSegments; i++) {
      const a = (tubularSegments + 1) * j + i - 1
      const b = (tubularSegments + 1) * (j - 1) + i - 1
      const c = (tubularSegments + 1) * (j - 1) + i
      const d = (tubularSegments + 1) * j + i

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  return { indices, vertices, normals, uvs }
}
