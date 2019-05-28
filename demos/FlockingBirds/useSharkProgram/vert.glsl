precision <<FLOAT_PRECISION>> float;

attribute vec3 position;
attribute vec3 normal;
attribute vec4 offset;
attribute vec4 color;
attribute vec2 index;

uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;

uniform float elapsed;

varying vec4 vColor;

vec3 lightDirection = vec3(0.0, -10.0, 0.0);
vec3 lightDiffuseColor = vec3(1.0);

void main(void) {
  vec3 offsetPosition = position.xyz + offset.xyz;

  float t = smoothstep(-14.0, 0.0, position.z);
  offsetPosition.x += sin(elapsed * offset.w) * 2.0 * (1.0 - t);

  offsetPosition.y += sin(elapsed * 0.2 * offset.w) * 4.0;

  mat4 modelViewMatrix = viewMatrix * modelMatrix;
  vec4 viewModelPosition = modelViewMatrix * vec4(offsetPosition, 1.0);

  gl_Position = projectionMatrix * viewModelPosition;

  vec3 p = normalize(lightDirection);
  vColor = vec4(color.rgb * lightDiffuseColor * dot(p, normal), 1.0);
}
