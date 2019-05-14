import glsl from 'glslify'

export default glsl`
  attribute vec3 position;
  attribute vec2 uv;
  attribute vec3 normal;

  uniform mat4 projectionMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;

  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  #pragma glslify: transpose = require('glsl-transpose')
  #pragma glslify: inverse = require('glsl-inverse')

  void main() {
    mat4 modelViewMatrix = viewMatrix * modelMatrix;
    vec4 viewModelPosition = modelViewMatrix * vec4(position, 1.0);

    vViewPosition = viewModelPosition.xyz;
    vUv = uv;

    gl_Position = projectionMatrix * viewModelPosition;

    mat3 normalMatrix = transpose(inverse(mat3(modelViewMatrix)));
    vNormal = normalize(normalMatrix * normal);
  }
`
