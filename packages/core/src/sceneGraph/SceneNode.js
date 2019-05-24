import throttle from 'lodash.throttle'
import warn from 'warning'
import Node from './GraphNode'
import {
  isCameraNode,
  isMaterialNode,
  isGeometryNode,
  isInstancedNode,
  instancedExt,
} from '.'
import { PointLights } from '../lights'

export const isSceneNode = Symbol('isSceneNode')

function getMode(ctx, modeString) {
  if (!modeString) {
    return ctx.TRIANGLES
  }

  switch (modeString) {
    case 'TRIANGLES':
      return ctx.TRIANGLES
    case 'LINES':
      return ctx.LINES
    case 'POINTS':
      return ctx.POINTS
    case 'LINE_STRIP':
      return ctx.LINE_STRIP
    case 'LINE_LOOP':
      return ctx.LINE_LOOP
    case 'TRIANGLE_STRIP':
      return ctx.TRIANGLE_STRIP
    case 'TRIANGLE_FAN':
      return ctx.TRIANGLE_FAN
    default:
      return ctx.TRIANGLES
  }
}

export class SceneNode extends Node {
  constructor(canvas, extensions, attrs) {
    super()

    const gl = canvas.getContext('webgl', attrs)

    this.context = gl
    this.element = canvas

    this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)

    this.extensions = extensions.reduce((acc, ext) => {
      acc[ext] = gl.getExtension(ext)
      return acc
    }, {})
  }

  [isSceneNode] = true
  renderOnUpdate = false

  pointLights = new PointLights()

  textureUnits = {}

  getTextureUnit(texture) {
    for (let unit = 0; unit < this.maxTextures; unit++) {
      if (!this.textureUnits[unit]) {
        this.textureUnits[unit] = texture
        return unit
      }
    }

    warn(false, `Max textures(${this.maxTextures}) exceeded.`)

    return this.maxTextures - 1
  }

  releaseTextureUnit(unit) {
    delete this.textureUnits[unit]
  }

  materialMap = new WeakMap()

  setMaterial(gl, { program }) {
    let material = this.materialMap.get(program)

    if (material) {
      return material
    }

    const attributes = {}

    const attribCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)

    for (let i = attribCount - 1; i >= 0; i--) {
      const name = gl.getActiveAttrib(program, i).name
      attributes[name] = gl.getAttribLocation(program, name)
    }

    const uniforms = {
      v: gl.getUniformLocation(program, 'viewMatrix'),
      m: gl.getUniformLocation(program, 'modelMatrix'),
      p: gl.getUniformLocation(program, 'projectionMatrix'),
    }

    material = { program, uniforms, attributes, attribCount }

    this.materialMap.set(program, material)

    return material
  }

  activeMaterial = null
  activeAttributes = null

  render = () => {
    const gl = this.context

    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(...this.clearColor)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    Object.keys(this.textureUnits).forEach(unit => {
      gl.activeTexture(gl[`TEXTURE${unit}`])
      gl.bindTexture(gl.TEXTURE_2D, this.textureUnits[unit])
    })

    const needsMatrixUpdate = this.needsMatrixUpdate === true

    if (needsMatrixUpdate) {
      this.updateMatrix()
      this.updateWorldMatrix()
      this.needsMatrixUpdate = false
    }

    for (let i = 0; i < this.children.length; i++) {
      this.renderNode(this.children[i], null, needsMatrixUpdate)
    }
  }

  requestRender = throttle(this.render, 17)

  renderNode(node, activeCamera, needsMatrixUpdate) {
    const gl = this.context

    // *************************************************
    // UPDATE MATRIX IF NEEDED
    // *************************************************
    needsMatrixUpdate = needsMatrixUpdate || node.needsMatrixUpdate === true

    if (needsMatrixUpdate) {
      node.updateMatrix()
      node.updateWorldMatrix()
      node.needsMatrixUpdate = false
    }

    // *************************************************
    // HANDLE CAMERA
    // *************************************************

    if (node[isCameraNode] === true) {
      activeCamera = node
    }

    // *************************************************
    // HANDLE MATERIAL
    // *************************************************

    if (node[isMaterialNode] === true) {
      const nextMaterial = this.setMaterial(gl, node)

      if (this.activeMaterial) {
        const diff = this.activeMaterial.attribCount - nextMaterial.attribCount
        
        if (diff > 0) {
          for (let i = 1; i <= diff; i++) {
            gl.disableVertexAttribArray(nextMaterial.attribCount)
          }
        }
      }

      this.activeMaterial = nextMaterial
      this.activeAttributes = null

      gl.useProgram(this.activeMaterial.program)

      const { view, projection } = activeCamera

      gl.uniformMatrix4fv(this.activeMaterial.uniforms.v, false, view)
      gl.uniformMatrix4fv(this.activeMaterial.uniforms.p, false, projection)
    }

    // *************************************************
    // HANDLE GEOMETRY
    // *************************************************

    if (node[isGeometryNode] === true) {
      gl.useProgram(this.activeMaterial.program)

      if (node.attributes !== this.activeAttributes) {
        for (const attr in this.activeMaterial.attributes) {
          const location = this.activeMaterial.attributes[attr]

          if (!node.attributes[attr]) {
            console.log(attr, node, this.activeMaterial)
          } else {
            node.attributes[attr](location)
          }
        }

        this.activeAttributes = node.attributes
      }

      gl.uniformMatrix4fv(
        this.activeMaterial.uniforms.m,
        false,
        node.worldMatrix,
      )

      if (node.drawArrays) {
        gl.drawArrays(
          getMode(gl, node.drawArrays.mode),
          node.drawArrays.first || 0,
          node.drawArrays.count,
        )
      } else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, node.index)

        gl.drawElements(
          getMode(gl, node.drawElements.mode),
          node.drawElements.count,
          node.drawElements.type
            ? gl[node.drawElements.type]
            : gl.UNSIGNED_SHORT,
          node.drawElements.offset || 0,
        )
      }

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    // *************************************************
    // HANDLE INSTANCED GEOMETRY
    // *************************************************

    if (node[isInstancedNode] === true) {
      gl.useProgram(this.activeMaterial.program)

      if (this.extensions[instancedExt] === undefined) {
        this.extensions[instancedExt] = gl.getExtension(instancedExt)
      }

      const ext = this.extensions[instancedExt]

      if (node.attributes !== this.activeAttributes) {
        for (const attr in this.activeMaterial.attributes) {
          const location = this.activeMaterial.attributes[attr]
          node.attributes[attr](location, ext)
        }

        this.activeAttributes = node.attributes
      }

      gl.uniformMatrix4fv(
        this.activeMaterial.uniforms.m,
        false,
        node.worldMatrix,
      )

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, node.index)

      ext.drawElementsInstancedANGLE(
        getMode(gl, node.drawElements.mode),
        node.drawElements.count,
        node.drawElements.type ? gl[node.drawElements.type] : gl.UNSIGNED_SHORT,
        node.drawElements.offset || 0,
        node.drawElements.primcount,
      )

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    for (let i = 0; i < node.children.length; i++) {
      this.renderNode(node.children[i], activeCamera, needsMatrixUpdate)
    }
  }
}
