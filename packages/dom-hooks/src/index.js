import { useRef, useState, useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

export function useMeasure(ref) {
  const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 })

  const resizeObserver = useRef(
    new ResizeObserver(([entry]) => set(entry.contentRect)),
  )

  useEffect(() => {
    const observer = resizeObserver.current

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [ref.current, resizeObserver])

  return bounds
}
