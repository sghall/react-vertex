import React, { useMemo, useState, useEffect } from 'react'
import { render } from 'react-dom'
import { SketchPicker } from 'react-color'
import { useHex, convertHex } from '@react-vertex/color-hooks'
import Slider from './Slider'

const theme = {
  text: '#333',
  background: '#fff',
  border: '1px solid #eee',
}

const controlsId = 'react-vertex-controls'
const sliderClass = 'react-vertex-slider-control'

function useControlsRoot() {
  const memoized = useMemo(() => {
    const existing = document.getElementById(controlsId)

    if (existing) {
      return existing
    }

    const controlsRoot = document.createElement('div')
    controlsRoot.setAttribute('id', controlsId)
    controlsRoot.style.width = '230px'
    controlsRoot.style.backgroundColor = theme.background
    controlsRoot.style.position = 'fixed'
    controlsRoot.style.top = '0'
    controlsRoot.style.right = '0'
    controlsRoot.style.zIndex = '10000'
    document.body.appendChild(controlsRoot)

    const button = document.createElement('button')
    button.style.backgroundColor = theme.background
    button.style.color = theme.text
    button.style.border = theme.border
    button.style.borderRadius = '4px'
    button.style.width = '100%'
    button.style.height = '35px'
    button.style.outline = 'none'
    button.style.cursor = 'pointer'
    button.style.userSelect = 'none'
    button.style.WebkitTapHighlightColor = 'transparent'
    button.style.zIndex = '10005'
    button.innerHTML = 'Show/Hide Dev Controls'
    controlsRoot.appendChild(button)

    const controlsContainer = document.createElement('div')
    controlsContainer.classList.add('container')
    controlsContainer.style.backgroundColor = theme.background
    controlsContainer.style.borderRadius = '4px'
    controlsContainer.style.width = '100%'
    controlsContainer.style.position = 'absolute'
    controlsContainer.style.maxHeight = '500px'
    controlsContainer.style.overflowX = 'hidden'
    controlsContainer.style.overflowY = 'scroll'
    controlsRoot.appendChild(controlsContainer)

    button.addEventListener('click', () => {
      if (
        !controlsContainer.style.top ||
        controlsContainer.style.top === 'unset'
      ) {
        controlsContainer.style.top = '-5000px'
      } else {
        controlsContainer.style.top = 'unset'
      }
    })

    return controlsRoot
  }, [])

  return memoized
}

export function useValueSlider(label, value, min = 1, max = 100, step = 1) {
  const [float, setFloat] = useState(value)
  const controlsRoot = useControlsRoot()

  useEffect(() => {
    if (!controlsRoot) {
      return null
    }

    const [container] = controlsRoot.getElementsByClassName('container')
    const sliderContainer = document.createElement('div')
    sliderContainer.classList.add(sliderClass)
    container.appendChild(sliderContainer)

    function ValueSliderApp() {
      return (
        <Slider
          defaultValues={[value]}
          step={step}
          label={label}
          domain={[min, max]}
          onUpdate={setFloat}
        />
      )
    }

    render(<ValueSliderApp />, sliderContainer)

    return () => {
      container.removeChild(sliderContainer)

      const sliders = container.getElementsByClassName(sliderClass)

      if (sliders.length === 0) {
        const root = document.getElementById(controlsId)
        document.body.removeChild(root)
      }
    }
  }, [controlsRoot, label, value, min, max, step])

  return Array.isArray(float) ? float[0] : float
}

export function useColorSlider(label, hex, noAlpha = false) {
  const inputColor = useHex(hex, noAlpha)

  const [color, setColor] = useState(inputColor)
  const controlsRoot = useControlsRoot()

  useEffect(() => {
    if (!controlsRoot) {
      return null
    }

    const [container] = controlsRoot.getElementsByClassName('container')
    const sliderContainer = document.createElement('div')
    sliderContainer.classList.add(sliderClass)
    container.appendChild(sliderContainer)

    function updateColor(color) {
      setColor(convertHex(color.hex, noAlpha))
    }

    function ColorSliderApp() {
      return (
        <div style={{ padding: 5 }}>
          <div
            style={{
              paddingLeft: 15,
              fontSize: '0.6rem',
              fontFamily: 'Roboto, Arial, Sans-Serif',
            }}
          >
            {label}
          </div>
          <SketchPicker color={hex} onChangeComplete={updateColor} />
        </div>
      )
    }

    render(<ColorSliderApp />, sliderContainer)

    return () => {
      container.removeChild(sliderContainer)

      const sliders = container.getElementsByClassName(sliderClass)

      if (sliders.length === 0) {
        const root = document.getElementById(controlsId)
        document.body.removeChild(root)
      }
    }
  }, [controlsRoot, label, hex, noAlpha])

  return color
}
