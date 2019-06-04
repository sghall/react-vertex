import { useEffect } from 'react'
// import { timer } from 'd3-timer'
import { useWebGLContext, useCanvas, useCanvasSize } from '@react-vertex/core'
import { TRANSPARENT, BACK_COLOR, SIM_RESOLUTION, DYE_RESOLUTION, SPLAT_RADIUS, CURL, PRESSURE_DISSIPATION, PRESSURE_ITERATIONS, VELOCITY_DISSIPATION, DENSITY_DISSIPATION } from './config'
import usePointers from './usePointers'
import { generateColor } from './utils'
// import useSplatProgram from './useSplatProgram'
// import useColorProgram from './useColorProgram'
// import useBackgroundProgram from './useBackgroundProgram'
// import useDisplayShadingProgram from './useDisplayShadingProgram'
// import useCurlProgram from './useCurlProgram'
// import useVorticityProgram from './useVorticityProgram'
// import useDivergenceProgram from './useDivergenceProgram'
// import useClearProgram from './useClearProgram'
// import usePressureProgram from './usePressureProgram'
// import useGradientProgram from './useGradientProgram'
// import useAdvectionProgram from './useAdvectionProgram'
import useResolution from './useResolution'
// import { useFBO, useDoubleFBO } from './useDoubleFBO'
// import useFormats from './useFormats'

export default function useSimulation() {
  const { width, height } = useCanvasSize()
  const canvas = useCanvas()

  console.log('useCanvasSize', width, height) // eslint-disable-line

  const gl = useWebGLContext()
  const pointers = usePointers()

  // const splat = useSplatProgram()
  // const color = useColorProgram()
  // const background = useBackgroundProgram()
  // const displayShading = useDisplayShadingProgram()

  // const curl = useCurlProgram()
  // const vorticity = useVorticityProgram()
  // const divergence = useDivergenceProgram()
  // const clear = useClearProgram()
  // const pressure = usePressureProgram()
  // const gradient = useGradientProgram()
  // const advection = useAdvectionProgram()

  const simSize = useResolution(SIM_RESOLUTION, width, height)
  const dyeSize = useResolution(DYE_RESOLUTION, width, height)

  // const { rgb, halfFloat, hasLinear } = useFormats(gl)
  // const filtering = hasLinear ? gl.LINEAR : gl.NEAREST

  // const velocityDFBO = useDoubleFBO(gl, simSize, rgb, halfFloat, filtering)
  // const densityDFBO = useDoubleFBO(gl, dyeSize, rgb, halfFloat, filtering)

  // const curlFBO = useFBO(gl, simSize, rgb, halfFloat, gl.NEAREST)
  // const divergenceFBO = useFBO(gl, simSize, rgb, halfFloat, gl.NEAREST)
  // const pressureDFBO = useDoubleFBO(gl, simSize, rgb, halfFloat, gl.NEAREST)

  useEffect(() => { 
    if (!width || !height) {
      return
    }
    
    let halfFloat = gl.getExtension('OES_texture_half_float')
    let supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear')

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    const halfFloatTexType =  halfFloat.HALF_FLOAT_OES
    

    const ext = {
      formatRGBA: { format: gl.RGBA, internalFormat: gl.RGBA },
      formatRG: { format: gl.RGBA, internalFormat: gl.RGBA },
      formatR: { format: gl.RGBA, internalFormat: gl.RGBA },
      halfFloatTexType,
      supportLinearFiltering
    }
        
    class GLProgram {
      constructor (vertexShader, fragmentShader) {
        this.uniforms = {}
        this.program = gl.createProgram()

        gl.attachShader(this.program, vertexShader)
        gl.attachShader(this.program, fragmentShader)
        gl.linkProgram(this.program)

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
          throw gl.getProgramInfoLog(this.program)

        const uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS)
        for (let i = 0; i < uniformCount; i++) {
          const uniformName = gl.getActiveUniform(this.program, i).name
          this.uniforms[uniformName] = gl.getUniformLocation(this.program, uniformName)
        }
      }
    
      bind () {
        gl.useProgram(this.program)
      }
    }
    
    function compileShader (type, source) {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
  
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        console.log(gl.getShaderInfoLog(shader)) //eslint-disable-line
  
      return shader
    }
    
    const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
        precision highp float;

        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;

        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
    `)

    const clearShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;

        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;

        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }
    `)

    const colorShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;

        uniform vec4 color;

        void main () {
            gl_FragColor = color;
        }
    `)

    const backgroundShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;

        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform float aspectRatio;

        #define SCALE 25.0

        void main () {
            vec2 uv = floor(vUv * SCALE * vec2(aspectRatio, 1.0));
            float v = mod(uv.x + uv.y, 2.0);
            v = v * 0.1 + 0.8;
            gl_FragColor = vec4(vec3(v), 1.0);
        }
    `)

    const displayShadingShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;

        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uTexture;
        uniform vec2 texelSize;

        void main () {
            vec3 L = texture2D(uTexture, vL).rgb;
            vec3 R = texture2D(uTexture, vR).rgb;
            vec3 T = texture2D(uTexture, vT).rgb;
            vec3 B = texture2D(uTexture, vB).rgb;
            vec3 C = texture2D(uTexture, vUv).rgb;

            float dx = length(R) - length(L);
            float dy = length(T) - length(B);

            vec3 n = normalize(vec3(dx, dy, length(texelSize)));
            vec3 l = vec3(0.0, 0.0, 1.0);

            float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
            C.rgb *= diffuse;

            float a = max(C.r, max(C.g, C.b));
            gl_FragColor = vec4(C, a);
        }
    `)

    const splatShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;

        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
    `)

    const advectionManualFilteringShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;

        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;

        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;

            vec2 iuv = floor(st);
            vec2 fuv = fract(st);

            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }

        void main () {
            vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
            gl_FragColor = dissipation * bilerp(uSource, coord, dyeTexelSize);
            gl_FragColor.a = 1.0;
        }
    `)

    const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;

        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform float dt;
        uniform float dissipation;

        void main () {
            vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
            gl_FragColor = dissipation * texture2D(uSource, coord);
            gl_FragColor.a = 1.0;
        }
    `)

    const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;

        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;

            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }

            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
    `)

    const curlShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;

        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
    `)

    const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;

        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;

        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;

            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;

            vec2 vel = texture2D(uVelocity, vUv).xy;
            gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
        }
    `)

    const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;

        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        vec2 boundary (vec2 uv) {
            return uv;
            // uncomment if you use wrap or repeat texture mode
            // uv = min(max(uv, 0.0), 1.0);
            // return uv;
        }

        void main () {
            float L = texture2D(uPressure, boundary(vL)).x;
            float R = texture2D(uPressure, boundary(vR)).x;
            float T = texture2D(uPressure, boundary(vT)).x;
            float B = texture2D(uPressure, boundary(vB)).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
    `)

    const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;

        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        vec2 boundary (vec2 uv) {
            return uv;
            // uv = min(max(uv, 0.0), 1.0);
            // return uv;
        }

        void main () {
            float L = texture2D(uPressure, boundary(vL)).x;
            float R = texture2D(uPressure, boundary(vR)).x;
            float T = texture2D(uPressure, boundary(vT)).x;
            float B = texture2D(uPressure, boundary(vB)).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
    `)

    
    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(0)
  
      return (destination) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, destination)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
      }
    })()
    
    let simWidth
    let simHeight
    let dyeWidth
    let dyeHeight
    let density
    let velocity
    let divergence
    let curl
    let pressure
    
    const clearProgram               = new GLProgram(baseVertexShader, clearShader)
    const colorProgram               = new GLProgram(baseVertexShader, colorShader)
    const backgroundProgram          = new GLProgram(baseVertexShader, backgroundShader)
    const displayShadingProgram      = new GLProgram(baseVertexShader, displayShadingShader)
    const splatProgram               = new GLProgram(baseVertexShader, splatShader)
    const advectionProgram           = new GLProgram(baseVertexShader, ext.supportLinearFiltering ? advectionShader : advectionManualFilteringShader)
    const divergenceProgram          = new GLProgram(baseVertexShader, divergenceShader)
    const curlProgram                = new GLProgram(baseVertexShader, curlShader)
    const vorticityProgram           = new GLProgram(baseVertexShader, vorticityShader)
    const pressureProgram            = new GLProgram(baseVertexShader, pressureShader)
    const gradienSubtractProgram     = new GLProgram(baseVertexShader, gradientSubtractShader)
    
    function initFramebuffers () {
      // console.log('simRes: ', simRes)
      // console.log('dyeRes: ', dyeRes)
  
      simWidth  = simSize[0]
      simHeight = simSize[1]
      dyeWidth  = dyeSize[0]
      dyeHeight = dyeSize[1]
  
      const texType = ext.halfFloatTexType
      const rgba    = ext.formatRGBA
      const rg      = ext.formatRG
      const r       = ext.formatR
      const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
    
      if (density == null)
        density = createDoubleFBO(dyeWidth, dyeHeight, rgba.internalFormat, rgba.format, texType, filtering)
      else
        density = resizeDoubleFBO(density, dyeWidth, dyeHeight, rgba.internalFormat, rgba.format, texType, filtering)
  
      if (velocity == null)
        velocity = createDoubleFBO(simWidth, simHeight, rg.internalFormat, rg.format, texType, filtering)
      else
        velocity = resizeDoubleFBO(velocity, simWidth, simHeight, rg.internalFormat, rg.format, texType, filtering)
  
      divergence = createFBO      (simWidth, simHeight, r.internalFormat, r.format, texType, gl.NEAREST)
      curl       = createFBO      (simWidth, simHeight, r.internalFormat, r.format, texType, gl.NEAREST)
      pressure   = createDoubleFBO(simWidth, simHeight, r.internalFormat, r.format, texType, gl.NEAREST)
    }
    
    function createFBO (w, h, internalFormat, format, type, param) {
      // console.log('createFBO: ', w, h, internalFormat, format, type, param)
      gl.activeTexture(gl.TEXTURE0)
      let texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)
  
      let fbo = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
      gl.viewport(0, 0, w, h)
      gl.clear(gl.COLOR_BUFFER_BIT)
    
      return {
        texture,
        fbo,
        width: w,
        height: h,
        attach (id) {
          gl.activeTexture(gl.TEXTURE0 + id)
          gl.bindTexture(gl.TEXTURE_2D, texture)
          return id
        }
      }
    }
    
    function createDoubleFBO (w, h, internalFormat, format, type, param) {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param)
      let fbo2 = createFBO(w, h, internalFormat, format, type, param)
  
      return {
        get read () {
          return fbo1
        },
        set read (value) {
          fbo1 = value
        },
        get write () {
          return fbo2
        },
        set write (value) {
          fbo2 = value
        },
        swap () {
          let temp = fbo1
          fbo1 = fbo2
          fbo2 = temp
        }
      }
    }
    
    function resizeFBO (target, w, h, internalFormat, format, type, param) {
      let newFBO = createFBO(w, h, internalFormat, format, type, param)
      clearProgram.bind()
      gl.uniform1i(clearProgram.uniforms.uTexture, target.attach(0))
      gl.uniform1f(clearProgram.uniforms.value, 1)
      blit(newFBO.fbo)
      return newFBO
    }
    
    function resizeDoubleFBO (target, w, h, internalFormat, format, type, param) {
      // console.log('resize FBO')
      target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param)
      target.write = createFBO(w, h, internalFormat, format, type, param)
      return target
    }
    
    initFramebuffers()

    const splatStack = []
    
    update()
    
    function update () {
      resizeCanvas()
      input()
      step(0.016)
      render(null)
      requestAnimationFrame(update)
    }

    
    function input () {
      if (splatStack.length > 0) {
        multipleSplats(splatStack.pop())
      }
  
      for (let i = 0; i < pointers.length; i++) {
        const p = pointers[i]
        if (p.moved) {
          splat(p.x, p.y, p.dx, p.dy, p.color)
          console.log(p.x, p.y, p.dx, p.dy, p.color) // eslint-disable-line
          p.moved = false
        }
      }
    }
    
    function step (dt) {
      gl.disable(gl.BLEND)
      gl.viewport(0, 0, simWidth, simHeight)
  
      curlProgram.bind()
      gl.uniform2f(curlProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight)
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0))
      blit(curl.fbo)
  
      vorticityProgram.bind()
      gl.uniform2f(vorticityProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight)
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0))
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1))
      gl.uniform1f(vorticityProgram.uniforms.curl, CURL)
      gl.uniform1f(vorticityProgram.uniforms.dt, dt)
      blit(velocity.write.fbo)
      velocity.swap()
    
      divergenceProgram.bind()
      gl.uniform2f(divergenceProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight)
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0))
      blit(divergence.fbo)
  
      clearProgram.bind()
      gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0))
      gl.uniform1f(clearProgram.uniforms.value, PRESSURE_DISSIPATION)
      blit(pressure.write.fbo)
      pressure.swap()
  
      pressureProgram.bind()
      gl.uniform2f(pressureProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight)
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0))
      for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1))
        blit(pressure.write.fbo)
        pressure.swap()
      }
    
      gradienSubtractProgram.bind()
      gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight)
      gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read.attach(0))
      gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1))
      blit(velocity.write.fbo)
      velocity.swap()
  
      advectionProgram.bind()
      gl.uniform2f(advectionProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight)
      if (!ext.supportLinearFiltering)
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, 1.0 / simWidth, 1.0 / simHeight)
      let velocityId = velocity.read.attach(0)
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId)
      gl.uniform1i(advectionProgram.uniforms.uSource, velocityId)
      gl.uniform1f(advectionProgram.uniforms.dt, dt)
      gl.uniform1f(advectionProgram.uniforms.dissipation, VELOCITY_DISSIPATION)
      blit(velocity.write.fbo)
      velocity.swap()
    
      gl.viewport(0, 0, dyeWidth, dyeHeight)
  
      if (!ext.supportLinearFiltering)
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, 1.0 / dyeWidth, 1.0 / dyeHeight)
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0))
      gl.uniform1i(advectionProgram.uniforms.uSource, density.read.attach(1))
      gl.uniform1f(advectionProgram.uniforms.dissipation, DENSITY_DISSIPATION)
      blit(density.write.fbo)
      density.swap()
    }
    
    function render (target) {
      if (target == null || !TRANSPARENT) {
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
        gl.enable(gl.BLEND)
      }
      else {
        gl.disable(gl.BLEND)
      }
    
      let width  = target == null ? gl.drawingBufferWidth : dyeWidth
      let height = target == null ? gl.drawingBufferHeight : dyeHeight
    
      gl.viewport(0, 0, width, height)
  
      if (!TRANSPARENT) {
        colorProgram.bind()
        let bc = BACK_COLOR
        gl.uniform4f(colorProgram.uniforms.color, bc.r / 255, bc.g / 255, bc.b / 255, 1)
        blit(target)
      }
    
      if (target == null && TRANSPARENT) {
        backgroundProgram.bind()
        gl.uniform1f(backgroundProgram.uniforms.aspectRatio, width / height)
        blit(null)
      }
    
      let program = displayShadingProgram
      program.bind()
      gl.uniform2f(program.uniforms.texelSize, 1.0 / width, 1.0 / height)
      gl.uniform1i(program.uniforms.uTexture, density.read.attach(0))

      blit(target)
    }
    
    function splat (x, y, dx, dy, color) {
      // console.log('point: ',  x / width, 1.0 - y / height)

      gl.viewport(0, 0, simWidth, simHeight)
      splatProgram.bind()
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0))
      gl.uniform1f(splatProgram.uniforms.aspectRatio, width / height)
      gl.uniform2f(splatProgram.uniforms.point, x / width, 1.0 - y / height)
      gl.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0)
      gl.uniform1f(splatProgram.uniforms.radius, SPLAT_RADIUS / 100.0)
      blit(velocity.write.fbo)
      velocity.swap()
    
      gl.viewport(0, 0, dyeWidth, dyeHeight)
      gl.uniform1i(splatProgram.uniforms.uTarget, density.read.attach(0))
      gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b)
      blit(density.write.fbo)
      density.swap()
    }
    
    function multipleSplats (amount) {
      for (let i = 0; i < amount; i++) {
        const color = generateColor()
        color.r *= 10.0
        color.g *= 10.0
        color.b *= 10.0
        const x = width * Math.random()
        const y = height * Math.random()
        const dx = 1000 * (Math.random() - 0.5)
        const dy = 1000 * (Math.random() - 0.5)
        splat(x, y, dx, dy, color)
      }
    }

    multipleSplats(parseInt(Math.random() * 20) + 5)
    
    function resizeCanvas () {
      // if (width != canvas.clientWidth || height != canvas.clientHeight) {
      //   width = canvas.clientWidth
      //   height = canvas.clientHeight
      //   initFramebuffers()
      // }
    }
    
    // function getResolution (resolution) {
    //   let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight
      
    //   if (aspectRatio < 1) {
    //     aspectRatio = 1.0 / aspectRatio
    //   }
  
    //   let max = Math.round(resolution * aspectRatio)
    //   let min = Math.round(resolution)
  
    //   if (gl.drawingBufferWidth > gl.drawingBufferHeight)
    //     return { width: max, height: min }
    //   else
    //     return { width: min, height: max }
    // }
  }, [gl, pointers, width, height, canvas])

  return 1
}
