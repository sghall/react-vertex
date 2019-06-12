export default `
  precision <<FLOAT_PRECISION>> float;

  // shader adapted from the awesome THREE.js demo:
  // https://github.com/mrdoob/three.js/blob/master/examples/webgl_gpgpu_birds.html

  float near = 0.0;
  float far = 7000.0;

  varying vec4 vColor;

  void main() {    
    float depth = gl_FragCoord.z / gl_FragCoord.w;  
    float depthcolor = 1.0 - smoothstep(near, far, depth);

    vec4 color = vec4((vColor.rgb * 1.1) * depthcolor, 1.0);

    gl_FragColor = color;
  }
`
