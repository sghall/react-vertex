export default `
  precision <<FLOAT_PRECISION>> float;

  varying vec3 vColor;
  varying vec3 vNormal;

  varying float vPhase;

  void main() {    
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float near = 0.0;
    float far = 20.0;
    float depthcolor = 1.0 - smoothstep(near, far, depth);

    // vec3 light1 = vec3(1.0, 1.0, 1.0);
    // light1 = normalize(light1);
    // float d1 = max(0.3, dot(vNormal, light1));
    
    // vec3 light2 = vec3(-0.5, -0.5, 1.0);
    // light2 = normalize(light2);
    // float d2 = max(0.3, dot(vNormal, light2)) * 6.5;

    // d1 *= d2;

    vec4 col = vec4((vColor.rgb * 1.0) * depthcolor, min(vPhase / 500.0, 0.6));

    // if (vPhase > 500.0) {
    //   col = vec4(1.0 - col.rgb, 0.5);
    // }

    gl_FragColor = vec4(vColor.rgb, 1.0);
  }
`
