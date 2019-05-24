import glsl from 'glslify'

export default glsl`
  precision <<FLOAT_PRECISION>> float;

  varying vec3 vColor;

  void main(void)  {
    gl_FragColor = vec4(vColor, 1.0);
  }
`
