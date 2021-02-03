export default `
  precision mediump float;

  // This shader is from the awesome demo at:
  // https://github.com/PavelDoGreat/WebGL-Fluid-Simulation

  uniform vec4 color;

  void main () {
    gl_FragColor = color;
  }
`
