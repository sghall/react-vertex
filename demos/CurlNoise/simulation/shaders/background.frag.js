export default `
  precision highp float;
  precision highp sampler2D;

  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float aspectRatio;

  #define SCALE 25.0

  void main () {
    vec2 uv = floor(vUv * SCALE * vec2(aspectRatio, 1.0));
    float v = mod(uv.x + uv.y, 2.0);
    v = v * 0.1 + 0.8;
    gl_FragColor = vec4(vec3(v), 1.0);
  }
`
