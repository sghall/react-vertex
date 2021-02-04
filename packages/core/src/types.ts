import { mat4, vec3 } from 'gl-matrix'

export type GLContext = WebGLRenderingContext | WebGL2RenderingContext

export type DataFormat = 'U8' | 'U16' | 'U32' | 'I8' | 'I16' | 'I32' | 'F32'
export type DataArray =
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | Int8Array
  | Int16Array
  | Int32Array
  | Float32Array
  | number[]

export type TextureOptions = {
  type?: number
  format?: number
  internalFormat?: number
  wrap?: number
  wrapS?: number
  wrapT?: number
  minMag?: number
  minFilter?: number
  magFilter?: number
  mipmaps?: boolean
  placeholder?: Uint8Array
  crossOrigin?: string
}

export type GetTextureOptions = (gl: GLContext) => TextureOptions

export type AttributeOptions = {
  type?: number
  normalized?: boolean
  stride?: number
  offset?: number
  target?: number
}

export type GetAttributeOptions = (gl: GLContext) => AttributeOptions

export type DrawMode =
  | 'TRIANGLES'
  | 'LINES'
  | 'POINTS'
  | 'LINE_STRIP'
  | 'LINE_LOOP'
  | 'TRIANGLE_STRIP'
  | 'TRIANGLE_FAN'

export type RenderMaterial = {
  program: WebGLProgram
  attributes: { [name: string]: number }
  attribCount: number
  uniforms: {
    v: WebGLUniformLocation | null
    m: WebGLUniformLocation | null
    p: WebGLUniformLocation | null
  }
}

export type GeometryAttributes = {
  [key: string]: (
    location: number,
    ext?: ANGLE_instanced_arrays,
    glVersion?: number,
  ) => void
}

export type GeometryDrawElements = {
  mode: DrawMode
  type: number
  count: number
  offset: number
}

export type InstancedDrawElements = {
  mode: DrawMode
  type: number
  count: number
  offset: number
  primcount: number
}

export type GeometryDrawArrays = {
  mode: DrawMode
  first: number
  count: number
}

export type MatrixProps = {
  matrix?: mat4
  position?: vec3
  rotation?: vec3
  scale?: vec3
}

export interface CameraNodeProps extends MatrixProps {
  view?: mat4
  projection?: mat4
}

export interface MaterialNodeProps extends MatrixProps {
  program?: WebGLProgram
}

export interface GeometryNodeProps extends MatrixProps {
  index?: number
  attributes?: GeometryAttributes
  drawArrays?: GeometryDrawArrays
  drawElements?: GeometryDrawElements
}

export interface InstancedNodeProps extends MatrixProps {
  index?: number
  attributes?: GeometryAttributes
  drawElements?: InstancedDrawElements
}
