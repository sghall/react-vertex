import { vec3, vec4, mat4 } from 'gl-matrix'
import throttle from 'lodash.throttle'

class OrbitCamera {
  constructor(fov, aspect, near = 1, far = 1000) {
    this.matrix = mat4.create()

    this.view = mat4.create()
    mat4.invert(this.view, this.matrix)

    const radians = (fov * Math.PI) / 180.0

    this.projection = mat4.create()
    mat4.perspective(this.projection, radians, aspect, near, far)
  }

  position = vec3.create()

  up = vec4.create()
  right = vec4.create()
  normal = vec4.create()

  userRotate = true
  userRotateX = true
  userRotateY = true

  userDolly = true 

  rotX = 0
  rotY = 0

  steps = 0

  listeners = []

  setProjection(fov, aspect, near = 1, far = 1000) {
    const radians = (fov * Math.PI) / 180.0
    mat4.perspective(this.projection, radians, aspect, near, far)
  }

  dolly(delta) {
    if (this.userDolly) {
      const next = vec3.create()
      const step = delta - this.steps

      next[0] = this.position[0]
      next[1] = this.position[1]
      next[2] = this.position[2] - step

      this.steps = delta
      this.setPosition(next)
    }
  }

  setPosition(position) {
    this.position[0] = position[0] || 0
    this.position[1] = position[1] || 0
    this.position[2] = position[2] || 0

    this.update()
  }

  upRightNormal() {
    const up = vec4.create()
    vec4.set(up, 0, 1, 0, 0)
    vec4.transformMat4(up, up, this.matrix)
    vec3.copy(this.up, up)

    const right = vec4.create()
    vec4.set(right, 1, 0, 0, 0)
    vec4.transformMat4(right, right, this.matrix)
    vec3.copy(this.right, right)

    const normal = vec4.create()
    vec4.set(normal, 0, 0, 1, 0)
    vec4.transformMat4(normal, normal, this.matrix)
    vec3.copy(this.normal, normal)
  }

  setRotationX(rotX) {
    this.rotX = rotX

    if (this.rotX > 360 || this.rotX < -360) {
      this.rotX = this.rotX % 360
    }

    this.update()
  }

  incRotationX(rotX) {
    if (this.userRotate && this.userRotateX) {
      this.rotX += rotX

      if (this.rotX > 360 || this.rotX < -360) {
        this.rotX = this.rotX % 360
      }
  
      this.update()
    }
  }

  setRotationY(rotY) {
    this.rotY = rotY

    if (this.rotY > 360 || this.rotY < -360) {
      this.rotY = this.rotY % 360
    }

    this.update()
  }

  incRotationY(rotY) {
    if (this.userRotate && this.userRotateY) {
      this.rotY += rotY

      if (this.rotY > 360 || this.rotY < -360) {
        this.rotY = this.rotY % 360
      }

      this.update()
    }
  }

  addListener(func, wait = 16) {
    const listener = throttle(func, wait)
    listener.id = func

    this.listeners.push(listener)
  }

  removeListener(func) {
    const index = this.listeners.findIndex(d => {
      return d.id === func
    })

    if (index !== -1) {
      this.listeners.splice(index, 1)
    }
  }

  exportView() {
    return mat4.clone(this.view)
  }

  update() {
    mat4.identity(this.matrix)

    mat4.rotateX(this.matrix, this.matrix, (this.rotX * Math.PI) / 180)
    mat4.rotateY(this.matrix, this.matrix, (this.rotY * Math.PI) / 180)
    mat4.translate(this.matrix, this.matrix, this.position)

    mat4.invert(this.view, this.matrix)

    this.upRightNormal()

    this.listeners.forEach(listener => {
      listener(this)
    })
  }
}

export default OrbitCamera
