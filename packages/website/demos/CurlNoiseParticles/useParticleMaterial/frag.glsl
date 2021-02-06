precision <<FLOAT_PRECISION>> float;

varying vec3 vColor;
varying float vPhase;

void main() {    
  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float near = 0.0;
  float far = 3000.0;
  float depthcolor = 1.0 - smoothstep(near, far, depth);

  vec4 col = vec4(vColor.rgb * depthcolor, min(vPhase / 2000.0, 0.5));

  gl_FragColor = col;
}