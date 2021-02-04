import throttle from 'lodash.throttle'
import warn from 'warning'
import Node from './GraphNode'
import { instancedExt, MaterialNode } from '.'
import { PointLights } from '../lights'
import {
  GLContext,
  DrawMode,
  RenderMaterial,
  GeometryAttributes,
} from '../types'
import GraphNode from './GraphNode'
import { CameraNode } from './CameraNode'
import { GeometryNode } from './GeometryNode'
import { InstancedNode } from './InstancedNode'

export const isSceneNode = Symbol('isSceneNode')

function getMode(gl: GLContext, modeString: DrawMode) {
  if (!modeString) {
    return gl.TRIANGLES
  }

  switch (modeString) {
    case 'TRIANGLES':
      return gl.TRIANGLES
    case 'LINES':
      return gl.LINES
    case 'POINTS':
      return gl.POINTS
    case 'LINE_STRIP':
      return gl.LINE_STRIP
    case 'LINE_LOOP':
      return gl.LINE_LOOP
    case 'TRIANGLE_STRIP':
      return gl.TRIANGLE_STRIP
    case 'TRIANGLE_FAN':
      return gl.TRIANGLE_FAN
    default:
      return gl.TRIANGLES
  }
}

export class SceneNode extends Node {
  context: GLContext
  element: HTMLCanvasElement
  maxTextures: number
  extensions: { [key: string]: any }
  constructor(canvas: HTMLCanvasElement, extensions: string[], gl: GLContext) {
    super()

    this.context = gl
    this.element = canvas

    this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)

    this.extensions = extensions.reduce((acc, ext) => {
      acc[ext] = gl.getExtension(ext)
      return acc
    }, {} as any)
  }

  [isSceneNode] = true
  renderOnUpdate = false
  webglVersion = 1

  pointLights = new PointLights()
  clearColor: [number, number, number, number] = [0, 0, 0, 0]

  textureUnits: { [unit: string]: WebGLTexture } = {}

  getTextureUnit(texture = false) {
    for (let unit = 0; unit < this.maxTextures; unit++) {
      if (this.textureUnits[unit] === undefined) {
        this.textureUnits[unit] = texture
        return unit
      }
    }

    warn(false, `Max textures(${this.maxTextures}) exceeded.`)

    return this.maxTextures - 1
  }

  releaseTextureUnit(unit: number) {
    delete this.textureUnits[unit]
  }

  materialMap = new WeakMap<WebGLProgram, RenderMaterial>()

  setMaterial(gl: GLContext, { program }: MaterialNode) {
    if (!program) {
      throw Error('Encountered material with no program.')
    }

    let material = this.materialMap.get(program)

    if (material) {
      return material
    }

    const attributes: { [name: string]: number } = {}

    const attribCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)

    for (let i = attribCount - 1; i >= 0; i--) {
      const attr = gl.getActiveAttrib(program, i)

      if (attr) {
        attributes[attr.name] = gl.getAttribLocation(program, attr.name)
      } else {
        warn(false, 'Encountered invalid attribute index.')
      }
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

  activeAttribCount = 0
  activeAttributes: GeometryAttributes | null = null

  render = () => {
    const gl = this.context

    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(...this.clearColor)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    Object.keys(this.textureUnits).forEach(unit => {
      if (this.textureUnits[unit] !== false) {
        /* @ts-ignore */
        gl.activeTexture(gl[`TEXTURE${unit}`])
        gl.bindTexture(gl.TEXTURE_2D, this.textureUnits[unit])
      }
    })

    const needsMatrixUpdate = this.needsMatrixUpdate === true

    if (needsMatrixUpdate) {
      this.updateMatrix()
      this.updateWorldMatrix()
      this.needsMatrixUpdate = false
    }

    for (let i = 0; i < this.children.length; i++) {
      this.renderNode(this.children[i], null, null, needsMatrixUpdate)
    }
  }

  requestRender: () => void = throttle(this.render, 17)

  renderNode(
    node: GraphNode,
    activeCamera: CameraNode | null,
    activeMaterial: RenderMaterial | null,
    needsMatrixUpdate: boolean,
  ) {
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

    if (node instanceof CameraNode) {
      activeCamera = node
    }

    // *************************************************
    // HANDLE MATERIAL
    // *************************************************

    if (node instanceof MaterialNode) {
      const nextMaterial = this.setMaterial(gl, node)

      // note: buffers are deleted when no longer in use by the buffer
      // hooks. So we to disable attribute indexes no longer in use or it
      // will throw an error about no buffer being bound to the index.
      const diff = this.activeAttribCount - nextMaterial.attribCount

      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          gl.disableVertexAttribArray(nextMaterial.attribCount + i)
        }
      }

      this.activeAttribCount = nextMaterial.attribCount
      this.activeAttributes = null

      activeMaterial = nextMaterial

      gl.useProgram(activeMaterial.program)

      if (activeCamera) {
        const { view, projection } = activeCamera

        gl.uniformMatrix4fv(activeMaterial.uniforms.v, false, view)
        gl.uniformMatrix4fv(activeMaterial.uniforms.p, false, projection)
      }
    }

    // *************************************************
    // HANDLE GEOMETRY
    // *************************************************

    if (node instanceof GeometryNode) {
      if (activeMaterial) {
        gl.useProgram(activeMaterial.program)

        if (node.attributes !== this.activeAttributes) {
          for (const attr in activeMaterial.attributes) {
            const location = activeMaterial.attributes[attr]
            node.attributes[attr](location)
          }

          this.activeAttributes = node.attributes
        }

        gl.uniformMatrix4fv(activeMaterial.uniforms.m, false, node.worldMatrix)

        if (node.drawArrays) {
          gl.drawArrays(
            getMode(gl, node.drawArrays.mode),
            node.drawArrays.first || 0,
            node.drawArrays.count,
          )
        } else if (node.drawElements) {
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, node.index)

          gl.drawElements(
            getMode(gl, node.drawElements.mode),
            node.drawElements.count,
            node.drawElements.type
              ? // @ts-ignore
                gl[node.drawElements.type]
              : gl.UNSIGNED_SHORT,
            node.drawElements.offset || 0,
          )
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
      }
    }

    // *************************************************
    // HANDLE INSTANCED GEOMETRY
    // *************************************************

    if (node instanceof InstancedNode) {
      if (activeMaterial) {
        gl.useProgram(activeMaterial.program)

        if (this.extensions[instancedExt] === undefined) {
          this.extensions[instancedExt] = gl.getExtension(instancedExt)
        }

        const ext = this.extensions[instancedExt]

        if (node.attributes !== this.activeAttributes) {
          for (const attr in activeMaterial.attributes) {
            const location = activeMaterial.attributes[attr]
            node.attributes[attr](location, ext, this.webglVersion)
          }

          this.activeAttributes = node.attributes
        }

        gl.uniformMatrix4fv(activeMaterial.uniforms.m, false, node.worldMatrix)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, node.index)

        if (gl instanceof WebGL2RenderingContext && node.drawElements) {
          gl.drawElementsInstanced(
            getMode(gl, node.drawElements.mode),
            node.drawElements.count,
            node.drawElements.type
              ? // @ts-ignore
                gl[node.drawElements.type]
              : gl.UNSIGNED_SHORT,
            node.drawElements.offset || 0,
            node.drawElements.primcount,
          )
        } else if (node.drawElements) {
          ext.drawElementsInstancedANGLE(
            getMode(gl, node.drawElements.mode),
            node.drawElements.count,
            node.drawElements.type
              ? // @ts-ignore
                gl[node.drawElements.type]
              : gl.UNSIGNED_SHORT,
            node.drawElements.offset || 0,
            node.drawElements.primcount,
          )
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
      }
    }

    for (let i = 0; i < node.children.length; i++) {
      this.renderNode(
        node.children[i],
        activeCamera,
        activeMaterial,
        needsMatrixUpdate,
      )
    }
  }
}
