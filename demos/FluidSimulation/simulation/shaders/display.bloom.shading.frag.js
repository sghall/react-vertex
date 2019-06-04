export default `
  precision highp float;
  precision highp sampler2D;

  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uTexture;
  uniform sampler2D uBloom;
  uniform sampler2D uDithering;
  uniform vec2 ditherScale;
  uniform vec2 texelSize;

  void main () {
    vec3 L = texture2D(uTexture, vL).rgb;
    vec3 R = texture2D(uTexture, vR).rgb;
    vec3 T = texture2D(uTexture, vT).rgb;
    vec3 B = texture2D(uTexture, vB).rgb;
    vec3 C = texture2D(uTexture, vUv).rgb;

    float dx = length(R) - length(L);
    float dy = length(T) - length(B);

    vec3 n = normalize(vec3(dx, dy, length(texelSize)));
    vec3 l = vec3(0.0, 0.0, 1.0);

    float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
    C *= diffuse;

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
