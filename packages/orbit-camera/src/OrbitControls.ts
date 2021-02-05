import { OrbitCamera } from './OrbitCamera'

export class OrbitControls {
  camera: OrbitCamera
  element: HTMLCanvasElement

  dollyStep: number
  dollyCurr: number

  constructor(camera: OrbitCamera, element: HTMLCanvasElement) {
    this.camera = camera
    this.element = element

    this.dollyStep =
      Math.max(
        this.camera.position[0],
        this.camera.position[1],
        this.camera.position[2],
      ) / 100

    this.dollyCurr = 0
  }

  dragging = false
  distance: number | null = null

  x = 0
  y = 0

  lastX = 0
  lastY = 0

  rotationSpeed = 1000

  onMouseUp = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    this.dragging = false
    this.distance = null
  }

  onTouchEnd = (e: TouchEvent) => {
    e.stopPropagation()
    e.preventDefault()

    this.dragging = false
    this.distance = null
  }

  onMouseDown = (e: MouseEvent) => {
    this.dragging = true

    e.stopPropagation()
    e.preventDefault()

    this.x = e.pageX
    this.y = e.pageY
  }

  onTouchStart = (e: TouchEvent) => {
    const [t1, t2] = e.touches

    e.stopPropagation()
    e.preventDefault()

    if (t2) {
      const a = t1.pageX - t2.pageX
      const b = t1.pageY - t2.pageY
      this.distance = Math.sqrt(a * a + b * b)
    } else {
      this.x = t1.pageX
      this.y = t1.pageY
      this.dragging = true
    }
  }

  onMouseMove = (e: MouseEvent) => {
    this.lastX = this.x
    this.lastY = this.y

    e.stopPropagation()
    e.preventDefault()

    this.x = e.pageX
    this.y = e.pageY

    if (!this.dragging) return

    const dx = this.lastX - this.x
    const dy = this.lastY - this.y

    this.rotate(dx, dy)
  }

  onTouchMove = (e: TouchEvent) => {
    const [t1, t2] = e.touches

    e.stopPropagation()
    e.preventDefault()

    if (t2) {
      if (!this.distance) {
        return
      }

      const a = t1.pageX - t2.pageX
      const b = t1.pageY - t2.pageY
      const nextDistance = Math.sqrt(a * a + b * b)

      if (this.distance > nextDistance) {
        this.dollyCurr -= this.dollyStep
      } else {
        this.dollyCurr += this.dollyStep
      }

      this.camera.dolly(this.dollyCurr)
      this.distance = nextDistance
    } else if (this.dragging) {
      this.lastX = this.x
      this.lastY = this.y

      this.x = t1.pageX
      this.y = t1.pageY

      const dx = this.lastX - this.x
      const dy = this.lastY - this.y

      this.rotate(dx, dy)
    }
  }

  onMouseWheel = (e: WheelEvent) => {
    e.stopPropagation()
    e.preventDefault()

    this.dolly(e.deltaY)
  }

  dolly(value: number) {
    if (value < 0) {
      this.dollyCurr += this.dollyStep
    } else {
      this.dollyCurr -= this.dollyStep
    }

    this.camera.dolly(this.dollyCurr)
  }

  rotate(dx: number, dy: number) {
    const { width, height } = this.element

    const incX = (dx / width) * this.rotationSpeed
    const incY = (dy / height) * this.rotationSpeed

    dx && this.camera.incRotationY(incX)
    dy && this.camera.incRotationX(incY)
  }
}
