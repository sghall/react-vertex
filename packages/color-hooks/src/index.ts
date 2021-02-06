import { useMemo } from 'react'
import hexRgb from 'hex-rgb'
import rgbHex from 'rgb-hex'

export function convertHex(hex: string, noAlpha: boolean = false) {
  const { red, green, blue, alpha } = hexRgb(hex)

  return noAlpha
    ? [red / 255, green / 255, blue / 255]
    : [red / 255, green / 255, blue / 255, alpha]
}

export function convertRgb(rgb: string, noAlpha: boolean = false) {
  const { red, green, blue, alpha } = hexRgb(rgbHex(rgb))

  return noAlpha
    ? [red / 255, green / 255, blue / 255]
    : [red / 255, green / 255, blue / 255, alpha]
}

export function useHex(hex: string, noAlpha: boolean = false) {
  const color = useMemo(() => {
    return convertHex(hex, noAlpha)
  }, [hex, noAlpha])

  return color
}

export function useRgb(rgb: string, noAlpha: boolean = false) {
  const color = useMemo(() => {
    return convertRgb(rgb, noAlpha)
  }, [rgb, noAlpha])

  return color
}
