export default `
  precision <<FLOAT_PRECISION>> float;

  uniform vec3 uKd;

  void main() {
    gl_FragColor = vec4(uKd, 1.0);
  }
`
