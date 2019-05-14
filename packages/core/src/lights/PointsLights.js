export default class PointLights {
  instances = []

  diffuse = []
  position = []

  add(diffuse = [0, 0, 0], position = [0, 0, 0]) {
    const index = this.instances.length
    const light = { index }

    this.diffuse = [...this.diffuse, ...diffuse]
    this.position = [...this.position, ...position]

    this.instances.push(light)

    return light
  }

  updateDiffuse({ index }, diffuse) {
    const nextDiffuse = [...this.diffuse]
    nextDiffuse[index * 3 + 0] = diffuse[0]
    nextDiffuse[index * 3 + 1] = diffuse[1]
    nextDiffuse[index * 3 + 2] = diffuse[2]

    this.diffuse = nextDiffuse
  }

  updatePosition({ index }, position) {
    const nextPosition = [...this.position]
    nextPosition[index * 3 + 0] = position[0]
    nextPosition[index * 3 + 1] = position[1]
    nextPosition[index * 3 + 2] = position[2]

    this.position = nextPosition
  }

  remove({ index }) {
    const len = this.instances.length * 3

    const diffuse = []
    const position = []

    for (let i = 0; i < len; i++) {
      if (i < index * 3 && i > index * 3 + 2) {
        diffuse.push(this.diffuse[i])
        position.push(this.position[i])
      }
    }

    const nextInstances = []

    for (let i = 0; i < this.instances.length; i++) {
      if (this.instances[i].index < index) {
        nextInstances.push(this.instances[i])
      } else if (this.instances[i].index > index) {
        this.instances[i].index = this.instances[i].index - 1
        nextInstances.push(this.instances[i])
      }
    }

    this.diffuse = diffuse
    this.position = position
    this.instances = nextInstances
  }
}
