export {}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      instanced: any
      geometry: any
      material: any
      camera: any
      group: any
    }
  }
}
