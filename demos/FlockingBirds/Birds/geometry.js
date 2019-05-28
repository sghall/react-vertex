import { interpolateYlGnBu } from 'd3-scale-chromatic'
import { convertRgb } from '@react-vertex/color-hooks'

const w = 30
const d = 12

const VERT_TYPE_1 = 1
const VERT_TYPE_2 = 2
const VERT_TYPE_3 = 3

// prettier-ignore
export const positions = [
  // BODY
  0, 0, -20, VERT_TYPE_1, 0, 6, -20, VERT_TYPE_1, 0, 0, 25, VERT_TYPE_1,

  // LEFT WING
  0, 0, +d, VERT_TYPE_1, 0, 0, -d, VERT_TYPE_1, -w, 0, -d, VERT_TYPE_2,
  -w, 0, +d, VERT_TYPE_2, 0, 0, d, VERT_TYPE_1, -w, 0, -d, VERT_TYPE_2,
  -w, 0, -d, VERT_TYPE_2, -w * 1.5, 0, -d, VERT_TYPE_3, -w, 0, +d, VERT_TYPE_2,
  
  // RIGHT WING
  0, 0, -d, VERT_TYPE_1, 0, 0, +d, VERT_TYPE_1, +w, 0, -d, VERT_TYPE_2, 
  +w, 0, -d, VERT_TYPE_2, 0, 0, d, VERT_TYPE_1, +w, 0, +d, VERT_TYPE_2,
  +w, 0, +d, VERT_TYPE_2, +w * 1.5, 0, -d, VERT_TYPE_3, +w, 0, -d, VERT_TYPE_2,
]

// prettier-ignore
export const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

const rowCount = 32

export const instanceCount = rowCount * rowCount

const cellX = 100
const cellY = 120

const variance = 2000

function createOffets() {
  const result = []

  let x = cellX / 2

  for (let i = 0; i < instanceCount; i += 4) {
    const y = Math.floor((i - 1) / rowCount) * cellY + cellY / 2
    const z = Math.random() * variance - variance / 2

    result.push(-x, +y, +z)
    result.push(-x, -y, +z)
    result.push(-x, -y, +z)
    result.push(-x, +y, +z)

    if (i % rowCount === 0) {
      x = cellX / 2
    } else {
      x += cellX
    }
  }

  return result
}

export const offsets = createOffets()

function createColors() {
  const result = []

  for (let i = 0; i < instanceCount; i++) {
    const rgb = interpolateYlGnBu(Math.random())
    result.push(...convertRgb(rgb))
  }

  return result
}

export const colors = createColors()
