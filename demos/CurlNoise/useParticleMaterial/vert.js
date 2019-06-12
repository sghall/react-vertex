export default `
  precision <<FLOAT_PRECISION>> float;

  attribute vec2 uv;
  attribute vec3 color;
  attribute vec3 position0;
  attribute vec3 position1;

  uniform sampler2D texPosition;

  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;
  uniform mat4 projectionMatrix;

  varying vec3 vColor;
  varying vec3 vNormal;
  varying float vPhase;

  mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(
      oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0,
      oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0,
      oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0,
      0.0, 0.0, 0.0, 1.0
    );
  }

  float getAngle(vec3 p1, vec3 p2) {
    return acos(dot(p1, p2) / (length(p1) * length(p2)));
  }

  vec3 rotate(vec3 v, vec3 axis, float angle) {
    mat4 m = rotationMatrix(axis, angle);
    return (m * vec4(v, 1.0)).xyz;
  }

  void main() {
    vec4 center = texture2D(texPosition, uv);
    vec3 mvPosition = center.xyz + position0.xyz;

    float angle = getAngle(center.xyz, position0.xyz);
    mvPosition = rotate(mvPosition, center.xyz, angle);

    vPhase = center.w;
    vNormal = vec3(0.0, 1.0, 0.0);
    vColor = color;

    mat4 modelViewMatrix = viewMatrix * modelMatrix;
    vec4 viewModelPosition = modelViewMatrix * vec4(mvPosition, 1.0);

    gl_Position = projectionMatrix * viewModelPosition;
  }
`
