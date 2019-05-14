precision <<FLOAT_PRECISION>> float;

uniform sampler2D texture;

varying vec4 vColor;
varying vec2 vUv;

void main(void) {
  gl_FragColor = mix(texture2D(texture, vUv), vColor, 0.5);
}