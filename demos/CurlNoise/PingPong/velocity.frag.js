export default `
  precision <<FLOAT_PRECISION>> float;

  uniform sampler2D texPosition;
  uniform sampler2D texVelocity;
  uniform vec2 resolution;

  uniform float delta;

  const float width = 16.0;
  const float height = 16.0;

  float separationDistance = 50.0;
  float alignmentDistance = 20.0;
  float cohesionDistance = 20.0;
  
  const float PI = 3.141592653589793;
  const float PI_2 = PI * 2.0;

  float zoneRadius = 40.0;
  float zoneRadiusSquared = 1600.0;
  float separationThresh = 0.45;
  float alignmentThresh = 0.65;

  const float SPEED_LIMIT = 9.0;

  float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    zoneRadius = separationDistance + alignmentDistance + cohesionDistance;
    separationThresh = separationDistance / zoneRadius;
    alignmentThresh = (separationDistance + alignmentDistance) / zoneRadius;
    zoneRadiusSquared = zoneRadius * zoneRadius;
    
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
    
    for (float y = 0.0; y < height; y++) {
      for (float x= 0.0; x < width; x++) {
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
