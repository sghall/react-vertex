import { useRef, useState, useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

const isBrowser = typeof window !== 'undefined'

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

export function useViewportSize() {
  const [dimensions, setDimensions] = useState({
    width: isBrowser ? window.innerWidth : 1,
    height: isBrowser ? window.innerHeight : 1,
  })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    isBrowser && window.addEventListener('resize', updateDimensions)

    return () => {
      isBrowser && window.removeEventListener('resize', updateDimensions)
    }
  }, [setDimensions])

  return dimensions
}
