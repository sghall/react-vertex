export default `
  precision mediump float;
  precision mediump sampler2D;

  // This shader is from the awesome demo at:
  // https://github.com/PavelDoGreat/WebGL-Fluid-Simulation

  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;

  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`
