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
    vec4 tmpPos = texture2D(texPosition, uv);
    vec3 pos = tmpPos.xyz;
    vec3 velocity = normalize(texture2D(texVelocity, uv).xyz);
    
    vec3 newPosition = position.xyz;

    float vertType = position.w;

    if (vertType == 1.0) {
      newPosition.y = sin(tmpPos.w) * 1.0;
    }
  
    if (vertType == 2.0) {
      newPosition.y = sin(tmpPos.w) * 3.0;
    }
    
    if (vertType == 3.0) {
      newPosition.y = sin(tmpPos.w) * 6.0;
    }
    
    newPosition = mat3(modelMatrix) * newPosition;

    velocity.z *= -1.;
    
    float xz = length( velocity.xz );
    float xyz = 1.0;
    float x = sqrt(1.0 - velocity.y * velocity.y);
    float cosry = velocity.x / xz;
    float sinry = velocity.z / xz;
    float cosrz = x / xyz;
    float sinrz = velocity.y / xyz;

    mat3 maty =  mat3(
      cosry, 0, -sinry,
      0    , 1, 0     ,
      sinry, 0, cosry
    );

    mat3 matz =  mat3(
      cosrz , sinrz, 0,
      -sinrz, cosrz, 0,
      0     , 0    , 1
    );

    newPosition = maty * matz * newPosition;
    newPosition += pos;

    vColor = vec4(color, 1.0);
  
    gl_Position = projectionMatrix * viewMatrix * vec4(newPosition, 1.0);
  }

`
