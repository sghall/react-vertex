import { useEffect, useMemo, useState } from 'react'

function applyTextureOptions(gl, texture, data, opts) {
  gl.bindTexture(gl.TEXTURE_2D, texture)

  const frmt = opts.format || gl.RGBA
  const type = opts.type || gl.UNSIGNED_BYTE
  gl.texImage2D(gl.TEXTURE_2D, 0, frmt, frmt, type, data)

  const wrapS = opts.wrap || opts.wrapS || gl.REPEAT
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS)

  const wrapT = opts.wrap || opts.wrapT || gl.REPEAT
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT)

  const minFilter = opts.minMag || opts.minFilter || gl.NEAREST_MIPMAP_LINEAR
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter)

  const magFilter = opts.minMag || opts.magFilter || gl.LINEAR
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter)

  if (opts.mipmaps !== false) {
    gl.generateMipmap(gl.TEXTURE_2D)
  }
}

const defaultPlaceholder = new Uint8Array([0, 0, 0, 1])

export function useTexture2d(gl, url, getOptions) {
  const [data, setData] = useState(null)

  const memoized = useMemo(() => {
    const texture = gl.createTexture()
    const options = getOptions ? getOptions(gl) : {}

    const placeholder = options.placeholder || defaultPlaceholder
      
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // prettier-ignore
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, placeholder)

    return texture
  }, [gl])

  useEffect(() => {
    const options = getOptions ? getOptions(gl) : {}

    if (data) {
      applyTextureOptions(gl, memoized, data, options)
    }
  }, [gl, memoized, data])

  useEffect(() => {
    const { crossOrigin } = getOptions ? getOptions(gl) : {}
    
    const img = new Image()
    img.crossOrigin = crossOrigin || ''
    img.src = url
    img.addEventListener('load', () => setData(img))
  }, [url])

  return [memoized, !!data]
}

export function useDataTexture(gl, data, width, height, getOptions) {
  const memoized = useMemo(() => {
    const texture = gl.createTexture()
    const options = getOptions ? getOptions(gl) : {}

    gl.bindTexture(gl.TEXTURE_2D, texture)

    const frmt = options.format || gl.RGBA
    const type = options.type || gl.UNSIGNED_BYTE
    gl.texImage2D(gl.TEXTURE_2D, 0, frmt, width, height, 0, frmt, type, data)

    const minFilter = options.minMag || options.minFilter || gl.NEAREST
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter)

    const magFilter = options.minMag || options.magFilter || gl.NEAREST
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter)

    const wrapS = options.wrap || options.wrapS || gl.CLAMP_TO_EDGE
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS)

    const wrapT = options.wrap || options.wrapT || gl.CLAMP_TO_EDGE
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT)

    return texture
  }, [gl, data, width, height, getOptions])

  return memoized
}
