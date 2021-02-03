import { interpolateGreys } from 'd3-scale-chromatic'
import { convertRgb } from '@react-vertex/color-hooks'

const rowCount = 12
const colCount = 8

export const instanceCount = rowCount * colCount

const cellX = 30
const cellY = 20
const cellZ = 250

const maxPerturbX = cellX * 0.08
const maxPerturbY = cellY * 0.08
const maxPerturbZ = cellZ * 0.5

const perturbX = d => d + Math.random() * maxPerturbX - maxPerturbX / 2
const perturbY = d => d + Math.random() * maxPerturbY - maxPerturbY / 2
const perturbZ = d => d + Math.random() * maxPerturbZ - maxPerturbZ / 2

function createOffets() {
  const result = []

  const xOffset = (colCount * cellX) / 2
  const yOffset = (rowCount * cellY) / 2

  for (let i = 0; i < colCount; i++) {
    const x = perturbX(i * cellX + cellX / 2)
    for (let j = 0; j < rowCount; j++) {
      const y = perturbY(j * cellY + cellY / 2)
      const z = perturbZ(1)
      result.push(x - xOffset, y - yOffset, z, Math.random())
    }
  }

  return result
}

export const offsets = createOffets()

function createColors() {
  const result = []

  for (let i = 0; i < instanceCount; i++) {
    const rgb = interpolateGreys(Math.random() - 0.3)
    result.push(...convertRgb(rgb))
  }

  return result
}

export const colors = createColors()
