import glsl from 'glslify'

export default glsl`
  precision <<FLOAT_PRECISION>> float;

  uniform sampler2D mapKd;
  uniform vec2 uVScale;

  varying vec2 vUv;

  #pragma glslify: toLinear = require('glsl-gamma/in')

  vec4 textureLinear(sampler2D uTex, vec2 uv) {
    return toLinear(texture2D(uTex, uv));
  }

  void main() {
    vec2 uv = vUv * uVScale;
    vec3 kd = textureLinear(mapKd, uv).rgb;

    gl_FragColor = vec4(kd, 1.0);
  }
`
