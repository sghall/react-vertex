import glsl from 'glslify'

export default glsl`
  precision <<FLOAT_PRECISION>> float;

  uniform vec3 uKd;
  uniform vec3 uKa;
  uniform float uNa;
  uniform vec3 uKs;
  uniform float uNs;
  
  const int NUM_POINT_LIGHTS = <<NUM_POINT_LIGHTS>>;
  uniform vec3 pointLd[NUM_POINT_LIGHTS];
  
  varying vec3 vNormal;
  varying vec3 vEye;
  varying vec3 vRay[NUM_POINT_LIGHTS];

  void main() {
    vec3 color = vec3(0.0);
    vec3 light = vec3(0.0);
    vec3 eye = normalize(vEye);
    vec3 reflection = vec3(0.0);
    vec3 normal = normalize(vNormal);
    vec3 ambient = uKd * uKa * uNa;

    for (int i = 0; i < NUM_POINT_LIGHTS; i++) {
      light = normalize(vRay[i]);
      reflection = reflect(light, normal);
      color += (pointLd[i] * uKd * clamp(dot(normal, -light), 0.0, 1.0));
      color += (uKs * pow(max(dot(reflection, eye), 0.0), uNs) * 1.0);
    }

    gl_FragColor = vec4(color + ambient, 1.0);
  }
`
