export default `
  precision <<FLOAT_PRECISION>> float;

  uniform sampler2D texPosition;
  uniform sampler2D texVelocity;
  uniform vec2 resolution;

  uniform float delta;

  float separationDistance = 50.0;
  float alignmentDistance = 20.0;
  float cohesionDistance = 20.0;
  
  const float PI = 3.141592653589793;
  const float PI_2 = PI * 2.0;
  const float MAX_RESOLUTION = 64.0;

  const float SPEED_LIMIT = 9.0;

  void main() {
    float zoneRadius = separationDistance + alignmentDistance + cohesionDistance;
    float separationThresh = separationDistance / zoneRadius;
    float alignmentThresh = (separationDistance + alignmentDistance) / zoneRadius;
    float zoneRadiusSquared = zoneRadius * zoneRadius;
    
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 birdPosition, birdVelocity;
    
    vec3 selfPosition = texture2D(texPosition, uv).xyz;
    vec3 selfVelocity = texture2D(texVelocity, uv).xyz;
    
    float distance;
    vec3 direction;
    float distSquared;
    
    float factor;
    float percent;
    vec3 velocity = selfVelocity;
    
    float limit = SPEED_LIMIT;
        
    vec3 central = vec3(0.0);
    direction = selfPosition - central;
    distance = length(direction);
    direction.y *= 2.5;
    velocity -= normalize(direction) * delta * 5.0;
    
    for (float y = 0.0; y < MAX_RESOLUTION; y++) {
      if (y >= resolution.y){
        break;
      }
      
      for (float x= 0.0; x < MAX_RESOLUTION; x++) {
        if (x >= resolution.x){
          break;
        }

        vec2 ref = vec2(x + 0.5, y + 0.5) / resolution.xy;
        
        birdPosition = texture2D(texPosition, ref).xyz;
        
        direction = birdPosition - selfPosition;
        
        distance = length(direction);
        if (distance < 0.0001) continue;
        
        distSquared = distance * distance;
        if (distSquared > zoneRadiusSquared) continue;
        
        percent = distSquared / zoneRadiusSquared;
        
        if (percent < separationThresh) { // low
          factor = (separationThresh / percent - 1.0) * delta;
          velocity -= normalize(direction) * factor;
        } else if (percent < alignmentThresh) { // high
          float threshDelta = alignmentThresh - separationThresh;
          float adjustedPercent = (percent - separationThresh) / threshDelta;
          birdVelocity = texture2D(texVelocity, ref).xyz;
          factor = (0.5 - cos(adjustedPercent * PI_2) * 0.5 + 0.5) * delta;
          velocity += normalize(birdVelocity) * factor;
        } else {
          float threshDelta = 1.0 - alignmentThresh;
          float adjustedPercent = (percent - alignmentThresh) / threshDelta;
          factor = (0.5 - (cos(adjustedPercent * PI_2) * -0.5 + 0.5)) * delta;
          velocity += normalize(direction) * factor;
        }
      }
    }

    if (length(velocity) > limit) {
      velocity = normalize(velocity) * limit;
    }

    gl_FragColor = vec4(velocity, 1.0);
  }
`
