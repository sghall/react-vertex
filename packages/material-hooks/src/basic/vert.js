export default `
  precision <<FLOAT_PRECISION>> float;

  attribute vec3 position;

  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;
  uniform mat4 projectionMatrix;

  void main() {
    mat4 modelViewMatrix = viewMatrix * modelMatrix;
    vec4 viewModelPosition = modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * viewModelPosition;
  }
`
