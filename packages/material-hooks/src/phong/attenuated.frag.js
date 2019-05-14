import glsl from 'glslify'

export default glsl`
  #extension GL_OES_standard_derivatives: enable
  precision highp float;

  // This shader code was adapted from:
  // https://github.com/stackgl/glsl-lighting-walkthrough

  varying vec2 vUv;
  varying vec3 vViewPosition;
  varying vec3 vNormal;

  #pragma glslify: computeDiffuse = require('glsl-diffuse-oren-nayar')
  #pragma glslify: attenuation = require('./attenuation')
  #pragma glslify: toLinear = require('glsl-gamma/in')

  const vec2 UV_SCALE = vec2(5.0, 5.0);
  const float roughness = 5.0;
  const float albedo = 2.5;

  const vec3 pointLightColor = vec3(1.0);
  const vec3 ambientLightColor = vec3(0.1);

  const float lightFalloff = 0.025;
  const float lightRadius = 10.0;

  uniform sampler2D texDiff;

  uniform mat4 viewMatrix;
  uniform vec3 uLightPosition;

  vec4 textureLinear(sampler2D uTex, vec2 uv) {
    return toLinear(texture2D(uTex, uv));
  }

  void main() {
    vec4 lightPosition = viewMatrix * vec4(uLightPosition, 1.0);
    vec3 lightVector = lightPosition.xyz - vViewPosition;

    float lightDistance = length(lightVector);
    float falloff = attenuation(lightRadius, lightFalloff, lightDistance);

    vec2 uv = vUv * UV_SCALE;
    vec3 diffuseColor = textureLinear(texDiff, uv).rgb;
    
    vec3 L = normalize(lightVector);   //light direction
    vec3 V = normalize(vViewPosition); //eye direction
    vec3 N = vNormal;                  //surface normal

    vec3 diffuse = pointLightColor * computeDiffuse(L, V, N, roughness, albedo) * falloff;

    vec3 color = vec3(0.0);
    color += diffuseColor * (diffuse + ambientLightColor);

    gl_FragColor.rgb = color;
    gl_FragColor.a = 1.0;
  }
`
