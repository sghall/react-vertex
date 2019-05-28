precision <<FLOAT_PRECISION>> float;

attribute vec4 position;
attribute vec4 color;
attribute vec3 offset;

uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;

uniform float elapsed;

varying vec4 vColor;

void main(void) {
  vec3 offsetPosition = position.xyz + offset;

  float vertType = position.w;

  vec4 adjustedColor = color;

  if (vertType == 1.0) {
    offsetPosition.y -= sin(elapsed) * 3.0;
  }

  if (vertType == 2.0) {
    offsetPosition.y += sin(elapsed) * 15.0;
    adjustedColor *= 0.6;
  }
  
  if (vertType == 3.0) {
    offsetPosition.y += sin(elapsed) * 30.0;
    adjustedColor *= 0.5;
  }

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(offsetPosition, 1.0);

  vColor = adjustedColor;
}
