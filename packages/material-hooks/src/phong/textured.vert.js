import glsl from 'glslify'

export default glsl`
  precision <<FLOAT_PRECISION>> float;

  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;
  uniform mat4 projectionMatrix;
  
  const int NUM_POINT_LIGHTS = <<NUM_POINT_LIGHTS>>;
  uniform vec3 pointLp[NUM_POINT_LIGHTS];
  
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;

  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vEye;
  varying vec3 vRay[NUM_POINT_LIGHTS];

  #pragma glslify: transpose = require('glsl-transpose')
  #pragma glslify: inverse = require('glsl-inverse')

  void main() {
    mat4 modelViewMatrix = viewMatrix * modelMatrix;
    vec4 viewModelPosition = modelViewMatrix * vec4(position, 1.0);
  
    mat3 normalMatrix = transpose(inverse(mat3(modelViewMatrix)));
    vNormal = vec3(normalMatrix * normal);

    for(int i = 0; i < NUM_POINT_LIGHTS; i++) {
      vec4 lightPosition = viewMatrix * vec4(pointLp[i], 1.0);
      vRay[i] = viewModelPosition.xyz - lightPosition.xyz;
    }

    vUv = uv;
    vEye = -vec3(viewModelPosition.xyz);


    gl_Position = projectionMatrix * viewModelPosition;
  }
`
