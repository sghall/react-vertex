export default `
  precision mediump float;
  precision mediump sampler2D;

  uniform sampler2D uVelocity;

  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;

  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;

    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`
