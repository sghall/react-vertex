export default `
  precision highp float;
  precision highp sampler2D;

  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform sampler2D uBloom;
  uniform sampler2D uDithering;
  uniform vec2 ditherScale;

  void main () {
    vec3 C = texture2D(uTexture, vUv).rgb;
    vec3 bloom = texture2D(uBloom, vUv).rgb;
    vec3 noise = texture2D(uDithering, vUv * ditherScale).rgb;
    noise = noise * 2.0 - 1.0;
    bloom += noise / 800.0;
    bloom = pow(bloom.rgb, vec3(1.0 / 2.2));
    C += bloom;
    float a = max(C.r, max(C.g, C.b));
    gl_FragColor = vec4(C, a);
  }
`
