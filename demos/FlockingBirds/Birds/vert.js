export default `
  precision <<FLOAT_PRECISION>> float;

  attribute vec4 position;
  attribute vec2 uv;
  attribute vec3 color;
  
  uniform sampler2D texPosition;
  uniform sampler2D texVelocity;

  uniform float elapsed;

  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;
  uniform mat4 projectionMatrix;

  varying vec4 vColor;

  void main() {
    vec3 offset = texture2D(texPosition, uv).xyz;
    vec3 velocity = normalize(texture2D(texVelocity, uv).xyz);

    vec3 adjustedPosition = position.xyz + offset;

    float vertType = position.w;
  
    vec4 adjustedColor = vec4(color, 1.0);
  
    if (vertType == 1.0) {
      adjustedPosition.y -= sin(elapsed) * 3.0;
      adjustedColor *= 0.9;
    }
  
    if (vertType == 2.0) {
      adjustedPosition.y += sin(elapsed) * 15.0;
      adjustedColor *= 1.1;
    }
    
    if (vertType == 3.0) {
      adjustedPosition.y += sin(elapsed) * 30.0;
      adjustedColor *= 1.2;
    }
    
    adjustedPosition = mat3(modelMatrix) * adjustedPosition;

    velocity.z *= -1.0;
    
    float xz = length(velocity.xz);
    float xyz = 1.0;
    float x = sqrt(1.0 - velocity.y * velocity.y);
    
    float cosry = velocity.x / xz;
    float sinry = velocity.z / xz;
    
    mat3 maty = mat3(cosry, 0, -sinry, 0, 1, 0, sinry, 0, cosry);
      
    float cosrz = x / xyz;
    float sinrz = velocity.y / xyz;
    
    mat3 matz = mat3(cosrz, sinrz, 0, -sinrz, cosrz, 0, 0, 0, 1);

    adjustedPosition = maty * matz * adjustedPosition;

    vColor = adjustedColor;

    gl_Position = projectionMatrix *  viewMatrix  * vec4(adjustedPosition, 1.0);
  }
`
