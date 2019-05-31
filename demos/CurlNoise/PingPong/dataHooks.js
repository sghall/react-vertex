import { useMemo } from 'react'

export function useRandomPositionData(size) {
  const data = useMemo(() => {
    const arr = new Float32Array(size * size * 4)

    for (let k = 0, kl = arr.length; k < kl; k += 4) {
      const r = 0.01 + Math.random() * 200
      const p = (Math.random() - 0.5) * Math.PI
      const t = Math.random() * Math.PI * 2
  
      arr[k + 0] = r * Math.cos(t) * Math.cos(p)
      arr[k + 1] = r * Math.sin(p)
      arr[k + 2] = r * Math.sin(t) * Math.cos(p)
      arr[k + 3] = Math.random()
    }
  
    return arr
  }, [size])

  return data
}

export function useRandomVelocityData(size) {
  const data = useMemo(() => {
    const arr = new Float32Array(size * size * 4)

    for (let k = 0, kl = arr.length; k < kl; k += 4) {
      const x = Math.random() - 0.5
      const y = Math.random() - 0.5
      const z = Math.random() - 0.5
  
      arr[k + 0] = x * 10
      arr[k + 1] = y * 10
      arr[k + 2] = z * 10
      arr[k + 3] = 1
    }
  
    return arr
  }, [size])

  return data
}

