export default `
  precision <<FLOAT_PRECISION>> float;

  attribute vec3 position;
  attribute vec3 color;
  
  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;
  uniform mat4 projectionMatrix;
  
  varying vec4 vColor;
  
  void main() {
    mat4 modelViewMatrix = viewMatrix * modelMatrix;
    vec4 viewModelPosition = modelViewMatrix * vec4(position, 1.0);
  
    gl_Position = projectionMatrix * viewModelPosition;
  
    vColor = vec4(color, 1.0);
  }
`
