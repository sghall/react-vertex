export default `
  precision <<FLOAT_PRECISION>> float;

  uniform sampler2D texture;
  uniform vec2 resolution;
  
  void main() {
  	vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    gl_FragColor = texture2D(texture, uv);
  }
`
