export default `
  precision <<FLOAT_PRECISION>> float;

  attribute vec2 uv;
  attribute vec3 color;
  attribute vec4 position;
  
  uniform sampler2D texPosition;
  uniform sampler2D texVelocity;

  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;
  uniform mat4 projectionMatrix;

  varying vec4 vColor;

  void main() {
    vec4 tempPosition = texture2D(texPosition, uv);
    vec3 pos = tempPosition.xyz;
    vec3 velocity = normalize(texture2D(texVelocity, uv).xyz);
    
    vec3 newPosition = position.xyz;
    vec3 newColor = color;

    float vertType = position.w;

    if (vertType == 1.0) {
      newColor *= 1.3;
    }
  
    if (vertType == 2.0) {
      newPosition.y = sin(tempPosition.w) * 3.0;
      newColor *= 0.6;
    }
    
    if (vertType == 3.0) {
      newPosition.y = sin(tempPosition.w) * 6.0;
      newColor *= 0.4;
    }
        
    float xz = length(velocity.xz);
    float xyz = 1.0;
    float x = sqrt(1.0 - velocity.y * velocity.y);
    float cosry = velocity.x / xz;
    float sinry = velocity.z / xz;
    float cosrz = x / xyz;
    float sinrz = velocity.y / xyz;

    mat3 maty = mat3(cosry, 0, -sinry, 0, 1, 0, sinry, 0, cosry);
    mat3 matz = mat3(cosrz, sinrz, 0, -sinrz, cosrz, 0, 0, 0, 1);

    newPosition = maty * matz * newPosition;
    newPosition += pos;

    vColor = vec4(newColor, 1.0);

    mat4 modelViewMatrix = viewMatrix * modelMatrix;
    vec4 viewModelPosition = modelViewMatrix * vec4(newPosition, 1.0);
  
    gl_Position = projectionMatrix * viewModelPosition;
  }
`
