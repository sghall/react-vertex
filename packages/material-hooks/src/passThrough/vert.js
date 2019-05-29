
export default `
  precision <<FLOAT_PRECISION>> float;

  attribute vec3 position;

  void main()	{
  	gl_Position = vec4(position, 1.0);
  }
`

function getPassThroughVertexShader() {
    return (
      'void main()	{\n' +
      '\n' +
      '	gl_Position = vec4( position, 1.0 );\n' +
      '\n' +
      '}\n'
    )
  }

  function getPassThroughFragmentShader() {
    return (
      'uniform sampler2D texture;\n' +
      '\n' +
      'void main() {\n' +
      '\n' +
      '	vec2 uv = gl_FragCoord.xy / resolution.xy;\n' +
      '\n' +
      '	gl_FragColor = texture2D( texture, uv );\n' +
      '\n' +
      '}\n'
    )
  }