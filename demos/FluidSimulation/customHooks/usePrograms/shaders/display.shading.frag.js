export default `
  precision highp float;
  precision highp sampler2D;

  // This shader is from the awesome demo at:
  // https://github.com/PavelDoGreat/WebGL-Fluid-Simulation

  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uTexture;
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
    C.rgb *= diffuse;

    float a = max(C.r, max(C.g, C.b));
    gl_FragColor = vec4(C, a);
  }
`
