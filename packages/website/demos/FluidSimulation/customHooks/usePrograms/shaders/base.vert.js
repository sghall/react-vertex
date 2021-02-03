export default `
  precision highp float;

  // This shader is from the awesome demo at:
  // https://github.com/PavelDoGreat/WebGL-Fluid-Simulation

  attribute vec2 aPosition;

  uniform vec2 texelSize;

  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);

    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`
