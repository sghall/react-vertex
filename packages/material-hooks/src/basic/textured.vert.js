import glsl from 'glslify'

export default glsl`
  precision <<FLOAT_PRECISION>> float;

  attribute vec3 position;
  attribute vec2 uv;

  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;
  uniform mat4 projectionMatrix;

  varying vec2 vUv;

  void main() {
    mat4 modelViewMatrix = viewMatrix * modelMatrix;
    vec4 viewModelPosition = modelViewMatrix * vec4(position, 1.0);

    vUv = uv;

    gl_Position = projectionMatrix * viewModelPosition;
  }
`
