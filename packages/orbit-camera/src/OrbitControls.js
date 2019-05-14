class OrbitControls {
  constructor(camera, element) {
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
  distance = null

  x = 0
  y = 0

  lastX = 0
  lastY = 0

  theta = 10

  onMouseUp = e => {
    e.stopPropagation()
    e.preventDefault()

    this.dragging = false
    this.distance = null
  }

  onTouchEnd = e => {
    e.stopPropagation()
    e.preventDefault()

    this.dragging = false
    this.distance = null
  }

  onMouseDown = e => {
    this.dragging = true

    e.stopPropagation()
    e.preventDefault()

    this.x = e.pageX
    this.y = e.pageY
  }

  onTouchStart = e => {
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

  onMouseMove = e => {
    this.lastX = this.x
    this.lastY = this.y

    e.stopPropagation()
    e.preventDefault()

    this.x = e.pageX
    this.y = e.pageY

    if (!this.dragging) return

    const dx = this.x - this.lastX
    const dy = this.y - this.lastY

    this.rotate(dx, dy)
  }

  onTouchMove = e => {
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

      const dx = this.x - this.lastX
      const dy = this.y - this.lastY

      this.rotate(dx, dy)
    }
  }

  onMouseWheel = e => {
    e.stopPropagation()
    e.preventDefault()

    this.dolly(e.deltaY)
  }

  dolly(value) {
    if (value < 0) {
      this.dollyCurr += this.dollyStep
    } else {
      this.dollyCurr -= this.dollyStep
    }

    this.camera.dolly(this.dollyCurr)
  }

  rotate(dx, dy) {
    const { width, height } = this.element

    const deltaRotX = 50 / width
    const deltaRotY = 50 / height

    const rotX = -dx * deltaRotX * this.theta
    const rotY = -dy * deltaRotY * this.theta

    this.camera.changeRotX(rotX)
    this.camera.changeRotY(rotY)
  }
}

export default OrbitControls
