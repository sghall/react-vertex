export { PhongSolid } from './PhongSolid'
export { PhongTextured } from './PhongTextured'
export { LambertSolid } from './LambertSolid'
export { LambertTextured } from './LambertTextured'
export { BasicSolid } from './BasicSolid'
export { BasicTextured } from './BasicTextured'

export interface DemoMaterialProps {
  textureUrl: string
  ambientLevel: number
  solidColor: number[]
}
