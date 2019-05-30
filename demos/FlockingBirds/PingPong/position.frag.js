export default `
  precision <<FLOAT_PRECISION>> float;

  uniform sampler2D texPosition;
  uniform sampler2D texVelocity;

  uniform float delta;

  void main()	{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 position = texture2D(texPosition, uv);
    vec3 velocity = texture2D(texVelocity, uv).xyz;
    
    float phase = position.w;
    phase = mod((phase + delta + length(velocity.xz) * delta * 1.0 + max(velocity.y, 0.0) * delta * 6.0), 62.83);
   
    gl_FragColor = vec4(position.xyz + velocity * delta * 15.0, phase);
  }
`