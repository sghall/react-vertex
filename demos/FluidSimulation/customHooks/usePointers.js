import { useEffect, useMemo } from 'react'
import { timer } from 'd3-timer'
import { useCanvas } from '@react-vertex/core'
import { generateColor } from '../utils'

export function Pointer() {
  this.id = -1
  this.x = 0
  this.y = 0
  this.dx = 0
  this.dy = 0
  this.down = false
  this.moved = false
  this.color = [30, 0, 300]
}

export default function usePointers() {
  const canvas = useCanvas()

  const pointers = useMemo(() => {
    return [new Pointer()]
  }, [])

  useEffect(() => {
    let lastColorChange = 0

    const timerLoop = timer(() => {
      if (lastColorChange + 100 < Date.now()) {
        lastColorChange = Date.now()

        for (let i = 0; i < pointers.length; i++) {
          const p = pointers[i]
          p.color = generateColor()
        }
      }
    })

    return () => timerLoop.stop()
  })

  useEffect(() => {
    function onMouseMove(e) {
      pointers[0].moved = pointers[0].down
      pointers[0].dx = (e.offsetX - pointers[0].x) * 5.0
      pointers[0].dy = (e.offsetY - pointers[0].y) * 5.0
      pointers[0].x = e.offsetX
      pointers[0].y = e.offsetY
    }

    function onTouchMove(e) {
      e.preventDefault()

      const touches = e.targetTouches

      for (let i = 0; i < touches.length; i++) {
        const pointer = pointers[i]
        pointer.moved = pointer.down
        pointer.dx = (touches[i].pageX - pointer.x) * 8.0
        pointer.dy = (touches[i].pageY - pointer.y) * 8.0
        pointer.x = touches[i].pageX
        pointer.y = touches[i].pageY
      }
    }

    function onMouseDown() {
      pointers[0].down = true
      pointers[0].color = generateColor()
    }

    function onTouchStart(e) {
      e.preventDefault()

      const touches = e.targetTouches

      for (let i = 0; i < touches.length; i++) {
        if (i >= pointers.length) {
          pointers.push(new Pointer())
        }

        pointers[i].id = touches[i].identifier
        pointers[i].down = true
        pointers[i].x = touches[i].pageX
        pointers[i].y = touches[i].pageY
        pointers[i].color = generateColor()
      }
    }

    function onMouseUp() {
      pointers[0].down = false
    }

    function onTouchEnd(e) {
      const touches = e.changedTouches

      for (let i = 0; i < touches.length; i++) {
        for (let j = 0; j < pointers.length; j++) {
          if (touches[i].identifier == pointers[j].id) {
            pointers[j].down = false
          }
        }
      }
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('touchmove', onTouchMove, false)
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('touchstart', onTouchStart)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('touchmove', onTouchMove, false)
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [pointers, canvas])

  return pointers
}
