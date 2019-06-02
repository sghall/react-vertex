export default `
  precision highp float;
  precision highp sampler2D;

  varying vec2 vUv;
  uniform sampler2D uTexture;

  void main () {
    vec3 C = texture2D(uTexture, vUv).rgb;
    float a = max(C.r, max(C.g, C.b));
    gl_FragColor = vec4(C, a);
  }
`
