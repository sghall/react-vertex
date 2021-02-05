export default `
  precision <<FLOAT_PRECISION>> float;

  varying vec4 vColor;
  
  void main() {
    gl_FragColor = vColor;
  }
`
