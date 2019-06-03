import { useMemo } from 'react'

export default function useResolution(size, width, height) {
  const memoized = useMemo(() => {
    let aspectRatio = width / height

    if (aspectRatio < 1) {
      aspectRatio = 1.0 / aspectRatio
    }

    const max = Math.round(size, width, height * aspectRatio)
    const min = Math.round(size, width, height)

    if (width > height) {
      return [max, min]
    } else {
      return [min, max]
    }
  }, [size, width, height])

  return memoized
}
