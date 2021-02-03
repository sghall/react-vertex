precision <<FLOAT_PRECISION>> float;

attribute vec3 position;
attribute vec4 color;
attribute vec2 uv;

uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;

varying vec4 vColor;
varying vec2 vUv;

void main(void) {
  vColor = color;
  vUv = uv;

  mat4 modelViewMatrix = viewMatrix * modelMatrix;
  vec4 viewModelPosition = modelViewMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * viewModelPosition;
}
