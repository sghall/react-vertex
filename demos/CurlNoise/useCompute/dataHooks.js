import { useMemo } from 'react'

export function useRandomPositionData(size) {
  const data = useMemo(() => {
    const arr = new Float32Array(size * size * 4)

    for (let k = 0, kl = arr.length; k < kl; k += 4) {
      const r = Math.random() * 1
      const u = Math.random()
      const v = Math.random()
      const t = 2 * Math.PI * u
      const p = Math.acos(2 * v - 1)
  
      arr[k + 0] = r * Math.sin(p) * Math.cos(t)
      arr[k + 1] = r * Math.sin(p) * Math.sin(t)
      arr[k + 2] = r * Math.cos(p)
      arr[k + 3] = Math.random() * 99
    }

    return arr
  }, [size])

  return data
}
