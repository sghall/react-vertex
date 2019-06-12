precision <<FLOAT_PRECISION>> float;

uniform vec2 resolution;
uniform float elapsed;
uniform float delta;
uniform sampler2D texPosition;

#pragma glslify: curlNoise = require(glsl-curl-noise)
#pragma glslify: snoise = require(glsl-noise/simplex/3d)

vec3 snoiseVec3( vec3 x ){
  float s  = snoise(vec3( x ));
  float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
  float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
  vec3 c = vec3( s , s1 , s2 );
  
  return c;
}

float speed = 0.03;
float factor = 0.03;
float evolution = 10.5;

float innerRadius = 1.5;
float outerRadius = 3.0;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;    
  vec4 c = texture2D(texPosition, uv);

  vec3 pos = c.xyz;
  float life = c.a;

  vec3 v = delta * speed * (curlNoise(0.8 * pos + factor * evolution * 0.1 * elapsed));
  pos += v;

  life -= factor;
  
  if (length(pos) < innerRadius) {
    pos = normalize(pos) * innerRadius;
  }

  if (length(pos) > outerRadius) {
    life = 2000.0;     
    pos = normalize(pos) * outerRadius;
  }
  
  if (life <= 0.0) {
    pos = snoiseVec3(vec3(uv.xxy));
    life = 100.0;
  }

  gl_FragColor = vec4(pos, life);
}
