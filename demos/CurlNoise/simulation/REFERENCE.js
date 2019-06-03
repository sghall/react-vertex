let config = {
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 512,
  DENSITY_DISSIPATION: 0.97,
  VELOCITY_DISSIPATION: 0.98,
  PRESSURE_DISSIPATION: 0.8,
  PRESSURE_ITERATIONS: 20,
  CURL: 30,
  SPLAT_RADIUS: 0.5,
  SHADING: true,
  COLORFUL: true,
  PAUSED: false,
  BACK_COLOR: { r: 0, g: 0, b: 0 },
  TRANSPARENT: false,
  BLOOM: true,
  BLOOM_ITERATIONS: 8,
  BLOOM_RESOLUTION: 256,
  BLOOM_INTENSITY: 0.8,
  BLOOM_THRESHOLD: 0.6,
  BLOOM_SOFT_KNEE: 0.7,
}

if (isMobile()) config.SHADING = false
if (!ext.supportLinearFiltering) {
  config.SHADING = false
  config.BLOOM = false
}

function getWebGLContext(canvas) {
  const params = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
  }

  let gl = canvas.getContext('webgl2', params)
  const isWebGL2 = !!gl
  if (!isWebGL2)
    gl =
      canvas.getContext('webgl', params) ||
      canvas.getContext('experimental-webgl', params)

  let halfFloat
  let supportLinearFiltering
  if (isWebGL2) {
    gl.getExtension('EXT_color_buffer_float')
    supportLinearFiltering = gl.getExtension('OES_texture_float_linear')
  } else {
    halfFloat = gl.getExtension('OES_texture_half_float')
    supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear')
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES
  let formatRGBA
  let formatRG
  let formatR

  if (isWebGL2) {
    formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType)
    formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType)
    formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType)
  } else {
    formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
    formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
    formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
  }

  return {
    gl,
    ext: {
      formatRGBA,
      formatRG,
      formatR,
      halfFloatTexType,
      supportLinearFiltering,
    },
  }
}

function getSupportedFormat(gl, internalFormat, format, type) {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    switch (internalFormat) {
      case gl.R16F:
        return getSupportedFormat(gl, gl.RG16F, gl.RG, type)
      case gl.RG16F:
        return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type)
      default:
        return null
    }
  }

  return {
    internalFormat,
    format,
  }
}

function supportRenderTextureFormat(gl, internalFormat, format, type) {
  let texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null)

  let fbo = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  )

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
  if (status != gl.FRAMEBUFFER_COMPLETE) return false
  return true
}

function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent)
}

class GLProgram {
  constructor(vertexShader, fragmentShader) {
    this.uniforms = {}
    this.program = gl.createProgram()

    gl.attachShader(this.program, vertexShader)
    gl.attachShader(this.program, fragmentShader)
    gl.linkProgram(this.program)

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
      throw gl.getProgramInfoLog(this.program)

    const uniformCount = gl.getProgramParameter(
      this.program,
      gl.ACTIVE_UNIFORMS,
    )
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = gl.getActiveUniform(this.program, i).name
      this.uniforms[uniformName] = gl.getUniformLocation(
        this.program,
        uniformName,
      )
    }
  }

  bind() {
    gl.useProgram(this.program)
  }
}

const blit = (() => {
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
    gl.STATIC_DRAW,
  )
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 0, 2, 3]),
    gl.STATIC_DRAW,
  )
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(0)

  return destination => {
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
let bloom

const clearProgram = new GLProgram(baseVertexShader, clearShader)
const colorProgram = new GLProgram(baseVertexShader, colorShader)
const backgroundProgram = new GLProgram(baseVertexShader, backgroundShader)
const displayProgram = new GLProgram(baseVertexShader, displayShader)
const displayBloomProgram = new GLProgram(baseVertexShader, displayBloomShader)
const displayShadingProgram = new GLProgram(
  baseVertexShader,
  displayShadingShader,
)
const displayBloomShadingProgram = new GLProgram(
  baseVertexShader,
  displayBloomShadingShader,
)
const bloomPrefilterProgram = new GLProgram(
  baseVertexShader,
  bloomPrefilterShader,
)
const bloomBlurProgram = new GLProgram(baseVertexShader, bloomBlurShader)
const bloomFinalProgram = new GLProgram(baseVertexShader, bloomFinalShader)
const splatProgram = new GLProgram(baseVertexShader, splatShader)
const advectionProgram = new GLProgram(
  baseVertexShader,
  ext.supportLinearFiltering ? advectionShader : advectionManualFilteringShader,
)
const divergenceProgram = new GLProgram(baseVertexShader, divergenceShader)
const curlProgram = new GLProgram(baseVertexShader, curlShader)
const vorticityProgram = new GLProgram(baseVertexShader, vorticityShader)
const pressureProgram = new GLProgram(baseVertexShader, pressureShader)
const gradienSubtractProgram = new GLProgram(
  baseVertexShader,
  gradientSubtractShader,
)

function initFramebuffers() {
  let simRes = getResolution(config.SIM_RESOLUTION)
  let dyeRes = getResolution(config.DYE_RESOLUTION)

  simWidth = simRes.width
  simHeight = simRes.height
  dyeWidth = dyeRes.width
  dyeHeight = dyeRes.height

  const texType = ext.halfFloatTexType
  const rgba = ext.formatRGBA
  const rg = ext.formatRG
  const r = ext.formatR
  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST

  if (density == null)
    density = createDoubleFBO(
      dyeWidth,
      dyeHeight,
      rgba.internalFormat,
      rgba.format,
      texType,
      filtering,
    )
  else
    density = resizeDoubleFBO(
      density,
      dyeWidth,
      dyeHeight,
      rgba.internalFormat,
      rgba.format,
      texType,
      filtering,
    )

  if (velocity == null)
    velocity = createDoubleFBO(
      simWidth,
      simHeight,
      rg.internalFormat,
      rg.format,
      texType,
      filtering,
    )
  else
    velocity = resizeDoubleFBO(
      velocity,
      simWidth,
      simHeight,
      rg.internalFormat,
      rg.format,
      texType,
      filtering,
    )

  divergence = createFBO(
    simWidth,
    simHeight,
    r.internalFormat,
    r.format,
    texType,
    gl.NEAREST,
  )
  curl = createFBO(
    simWidth,
    simHeight,
    r.internalFormat,
    r.format,
    texType,
    gl.NEAREST,
  )
  pressure = createDoubleFBO(
    simWidth,
    simHeight,
    r.internalFormat,
    r.format,
    texType,
    gl.NEAREST,
  )
}

function createFBO(w, h, internalFormat, format, type, param) {
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
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  )
  gl.viewport(0, 0, w, h)
  gl.clear(gl.COLOR_BUFFER_BIT)

  return {
    texture,
    fbo,
    width: w,
    height: h,
    attach(id) {
      gl.activeTexture(gl.TEXTURE0 + id)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      return id
    },
  }
}

function createDoubleFBO(w, h, internalFormat, format, type, param) {
  let fbo1 = createFBO(w, h, internalFormat, format, type, param)
  let fbo2 = createFBO(w, h, internalFormat, format, type, param)

  return {
    get read() {
      return fbo1
    },
    set read(value) {
      fbo1 = value
    },
    get write() {
      return fbo2
    },
    set write(value) {
      fbo2 = value
    },
    swap() {
      let temp = fbo1
      fbo1 = fbo2
      fbo2 = temp
    },
  }
}

function resizeFBO(target, w, h, internalFormat, format, type, param) {
  let newFBO = createFBO(w, h, internalFormat, format, type, param)
  clearProgram.bind()
  gl.uniform1i(clearProgram.uniforms.uTexture, target.attach(0))
  gl.uniform1f(clearProgram.uniforms.value, 1)
  blit(newFBO.fbo)
  return newFBO
}

function resizeDoubleFBO(target, w, h, internalFormat, format, type, param) {
  target.read = resizeFBO(
    target.read,
    w,
    h,
    internalFormat,
    format,
    type,
    param,
  )
  target.write = createFBO(w, h, internalFormat, format, type, param)
  return target
}

initFramebuffers()
multipleSplats(parseInt(Math.random() * 20) + 5)

let lastColorChangeTime = Date.now()

update()

function update() {
  resizeCanvas()
  input()
  if (!config.PAUSED) step(0.016)
  render(null)
  requestAnimationFrame(update)
}

function input() {
  if (splatStack.length > 0) multipleSplats(splatStack.pop())

  for (let i = 0; i < pointers.length; i++) {
    const p = pointers[i]
    if (p.moved) {
      splat(p.x, p.y, p.dx, p.dy, p.color)
      p.moved = false
    }
  }

  if (!config.COLORFUL) return

  if (lastColorChangeTime + 100 < Date.now()) {
    lastColorChangeTime = Date.now()
    for (let i = 0; i < pointers.length; i++) {
      const p = pointers[i]
      p.color = generateColor()
    }
  }
}

function step(dt) {
  gl.disable(gl.BLEND)
  gl.viewport(0, 0, simWidth, simHeight)

  curlProgram.bind()
  gl.uniform2f(curlProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight)
  gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0))
  blit(curl.fbo)

  vorticityProgram.bind()
  gl.uniform2f(
    vorticityProgram.uniforms.texelSize,
    1.0 / simWidth,
    1.0 / simHeight,
  )
  gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0))
  gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1))
  gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL)
  gl.uniform1f(vorticityProgram.uniforms.dt, dt)
  blit(velocity.write.fbo)
  velocity.swap()

  divergenceProgram.bind()
  gl.uniform2f(
    divergenceProgram.uniforms.texelSize,
    1.0 / simWidth,
    1.0 / simHeight,
  )
  gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0))
  blit(divergence.fbo)

  clearProgram.bind()
  gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0))
  gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE_DISSIPATION)
  blit(pressure.write.fbo)
  pressure.swap()

  pressureProgram.bind()
  gl.uniform2f(
    pressureProgram.uniforms.texelSize,
    1.0 / simWidth,
    1.0 / simHeight,
  )
  gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0))
  for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
    gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1))
    blit(pressure.write.fbo)
    pressure.swap()
  }

  gradienSubtractProgram.bind()
  gl.uniform2f(
    gradienSubtractProgram.uniforms.texelSize,
    1.0 / simWidth,
    1.0 / simHeight,
  )
  gl.uniform1i(
    gradienSubtractProgram.uniforms.uPressure,
    pressure.read.attach(0),
  )
  gl.uniform1i(
    gradienSubtractProgram.uniforms.uVelocity,
    velocity.read.attach(1),
  )
  blit(velocity.write.fbo)
  velocity.swap()

  advectionProgram.bind()
  gl.uniform2f(
    advectionProgram.uniforms.texelSize,
    1.0 / simWidth,
    1.0 / simHeight,
  )
  if (!ext.supportLinearFiltering)
    gl.uniform2f(
      advectionProgram.uniforms.dyeTexelSize,
      1.0 / simWidth,
      1.0 / simHeight,
    )
  let velocityId = velocity.read.attach(0)
  gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId)
  gl.uniform1i(advectionProgram.uniforms.uSource, velocityId)
  gl.uniform1f(advectionProgram.uniforms.dt, dt)
  gl.uniform1f(
    advectionProgram.uniforms.dissipation,
    config.VELOCITY_DISSIPATION,
  )
  blit(velocity.write.fbo)
  velocity.swap()

  gl.viewport(0, 0, dyeWidth, dyeHeight)

  if (!ext.supportLinearFiltering)
    gl.uniform2f(
      advectionProgram.uniforms.dyeTexelSize,
      1.0 / dyeWidth,
      1.0 / dyeHeight,
    )
  gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0))
  gl.uniform1i(advectionProgram.uniforms.uSource, density.read.attach(1))
  gl.uniform1f(
    advectionProgram.uniforms.dissipation,
    config.DENSITY_DISSIPATION,
  )
  blit(density.write.fbo)
  density.swap()
}

function render(target) {
  if (target == null || !config.TRANSPARENT) {
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
  } else {
    gl.disable(gl.BLEND)
  }

  let width = target == null ? gl.drawingBufferWidth : dyeWidth
  let height = target == null ? gl.drawingBufferHeight : dyeHeight

  gl.viewport(0, 0, width, height)

  if (!config.TRANSPARENT) {
    colorProgram.bind()
    let bc = config.BACK_COLOR
    gl.uniform4f(
      colorProgram.uniforms.color,
      bc.r / 255,
      bc.g / 255,
      bc.b / 255,
      1,
    )
    blit(target)
  }

  if (target == null && config.TRANSPARENT) {
    backgroundProgram.bind()
    gl.uniform1f(
      backgroundProgram.uniforms.aspectRatio,
      canvas.width / canvas.height,
    )
    blit(null)
  }

  if (config.SHADING) {
    let program = config.BLOOM
      ? displayBloomShadingProgram
      : displayShadingProgram
    program.bind()
    gl.uniform2f(program.uniforms.texelSize, 1.0 / width, 1.0 / height)
    gl.uniform1i(program.uniforms.uTexture, density.read.attach(0))
  } else {
    let program = config.BLOOM ? displayBloomProgram : displayProgram
    program.bind()
    gl.uniform1i(program.uniforms.uTexture, density.read.attach(0))
  }

  blit(target)
}

function splat(x, y, dx, dy, color) {
  gl.viewport(0, 0, simWidth, simHeight)
  splatProgram.bind()
  gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0))
  gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height)
  gl.uniform2f(
    splatProgram.uniforms.point,
    x / canvas.width,
    1.0 - y / canvas.height,
  )
  gl.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0)
  gl.uniform1f(splatProgram.uniforms.radius, config.SPLAT_RADIUS / 100.0)
  blit(velocity.write.fbo)
  velocity.swap()

  gl.viewport(0, 0, dyeWidth, dyeHeight)
  gl.uniform1i(splatProgram.uniforms.uTarget, density.read.attach(0))
  gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b)
  blit(density.write.fbo)
  density.swap()
}

function multipleSplats(amount) {
  for (let i = 0; i < amount; i++) {
    const color = generateColor()
    color.r *= 10.0
    color.g *= 10.0
    color.b *= 10.0
    const x = canvas.width * Math.random()
    const y = canvas.height * Math.random()
    const dx = 1000 * (Math.random() - 0.5)
    const dy = 1000 * (Math.random() - 0.5)
    splat(x, y, dx, dy, color)
  }
}

function resizeCanvas() {
  if (
    canvas.width != canvas.clientWidth ||
    canvas.height != canvas.clientHeight
  ) {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    initFramebuffers()
  }
}

function getResolution(resolution) {
  let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight
  if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio

  let max = Math.round(resolution * aspectRatio)
  let min = Math.round(resolution)

  if (gl.drawingBufferWidth > gl.drawingBufferHeight)
    return { width: max, height: min }
  else return { width: min, height: max }
}

function getTextureScale(texture, width, height) {
  return {
    x: width / texture.width,
    y: height / texture.height,
  }
}
